import { useMemo, useState } from 'react';
import { PanResponder, View } from 'react-native';

type LimitSliderProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function LimitSlider({ value, min = 0, max = 100, step = 5, onChange }: LimitSliderProps) {
  const [width, setWidth] = useState(0);

  const panResponder = useMemo(() => {
    const updateFromX = (x: number) => {
      if (width <= 0) {
        return;
      }

      const ratio = Math.min(1, Math.max(0, x / width));
      const next = Math.round((min + ratio * (max - min)) / step) * step;

      onChange(Math.min(max, Math.max(min, next)));
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => updateFromX(event.nativeEvent.locationX),
      onPanResponderMove: (event) => updateFromX(event.nativeEvent.locationX),
    });
  }, [width, min, max, step, onChange]);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <View
      {...panResponder.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Дневной лимит в рублях"
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          onChange(Math.min(max, value + step));
        } else if (event.nativeEvent.actionName === 'decrement') {
          onChange(Math.max(min, value - step));
        }
      }}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      className="h-8 w-full items-stretch justify-center">
      <View pointerEvents="none" className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
        <View className="h-full rounded-full bg-primary-container" style={{ width: `${percent}%` }} />
      </View>
      <View
        pointerEvents="none"
        className="absolute top-1/2 h-6 w-6 -translate-x-3 -translate-y-3 items-center justify-center rounded-full bg-surface-lowest shadow-md"
        style={{ left: `${percent}%` }}>
        <View className="h-2.5 w-2.5 rounded-full bg-primary-container" />
      </View>
    </View>
  );
}

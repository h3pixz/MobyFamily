import { View } from 'react-native';

type ProgressBarProps = {
  value: number;
  trackClassName?: string;
  barClassName?: string;
  heightClassName?: string;
};

export function ProgressBar({
  value,
  trackClassName = 'bg-surface-container',
  barClassName = 'bg-primary-container',
  heightClassName = 'h-2',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value * 100));

  return (
    <View className={`w-full overflow-hidden rounded-full ${trackClassName} ${heightClassName}`}>
      <View className={`h-full rounded-full ${barClassName}`} style={{ width: `${percent}%` }} />
    </View>
  );
}

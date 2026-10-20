import { View } from 'react-native';

type ProgressBarProps = {
  value: number;
  trackClassName?: string;
  barClassName?: string;
  heightClassName?: string;
};

export function ProgressBar({
  value,
  trackClassName = 'bg-track',
  barClassName = 'bg-accent',
  heightClassName = 'h-2.5',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value * 100));

  return (
    <View className={`w-full overflow-hidden rounded-full ${trackClassName} ${heightClassName}`}>
      <View className={`h-full rounded-full ${barClassName}`} style={{ width: `${percent}%` }} />
    </View>
  );
}

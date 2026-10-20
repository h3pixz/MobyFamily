import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

export type BadgeTone = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'success' | 'warning' | 'info';

const tones: Record<BadgeTone, { container: string; text: string; color: string }> = {
  primary: { container: 'bg-primary-fixed', text: 'text-primary', color: '#004BC3' },
  secondary: {
    container: 'bg-secondary-fixed',
    text: 'text-on-secondary-fixed',
    color: '#FB7800',
  },
  tertiary: { container: 'bg-tertiary-fixed', text: 'text-tertiary', color: '#006242' },
  neutral: {
    container: 'bg-surface-container',
    text: 'text-on-surface-variant',
    color: '#424655',
  },
  success: { container: 'bg-success-soft', text: 'text-success', color: '#00B856' },
  warning: { container: 'bg-warning/15', text: 'text-warning', color: '#FF7A00' },
  info: { container: 'bg-primary-soft', text: 'text-primary-container', color: '#1D63ED' },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
  dot?: boolean;
  className?: string;
};

export function Badge({ label, tone = 'primary', icon, dot, className = '' }: BadgeProps) {
  const style = tones[tone];

  return (
    <View
      className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${style.container} ${className}`}>
      {dot ? (
        <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
      ) : null}
      {icon ? <Icon name={icon} size={13} color={style.color} /> : null}
      <Text className={`text-label-sm font-inter-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}

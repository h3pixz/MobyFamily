import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

export type BadgeTone = 'primary' | 'accent' | 'warning' | 'amber' | 'neutral' | 'glass';

const tones: Record<BadgeTone, { container: string; text: string; color: string }> = {
  primary: { container: 'bg-primary-soft', text: 'text-primary', color: '#1D63ED' },
  accent: {
    container: 'bg-accent-soft border border-emerald-200',
    text: 'text-accent',
    color: '#10B981',
  },
  warning: {
    container: 'bg-warning-soft border border-warning-border',
    text: 'text-warning',
    color: '#FF7A00',
  },
  amber: {
    container: 'bg-amber-100 border border-amber-200',
    text: 'text-amber-600',
    color: '#D97706',
  },
  neutral: { container: 'bg-slate-100', text: 'text-slate-500', color: '#64748B' },
  glass: {
    container: 'bg-white/20 border border-white/20',
    text: 'text-white',
    color: '#FFFFFF',
  },
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
      {dot ? <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} /> : null}
      {icon ? <Icon name={icon} size={13} color={style.color} /> : null}
      <Text className={`text-[11px] font-inter-semibold ${style.text}`}>{label}</Text>
    </View>
  );
}

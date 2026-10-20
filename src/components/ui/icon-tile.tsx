import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type IconTileTone =
  | 'primary'
  | 'accent'
  | 'warning'
  | 'amber'
  | 'neutral'
  | 'solidPrimary'
  | 'outline';

type IconTileSize = 'sm' | 'md' | 'lg';

const tones: Record<IconTileTone, { container: string; color: string }> = {
  primary: { container: 'bg-primary-soft', color: '#1D63ED' },
  accent: { container: 'bg-accent-soft', color: '#10B981' },
  warning: { container: 'bg-warning-soft', color: '#FF7A00' },
  amber: { container: 'bg-amber-100', color: '#D97706' },
  neutral: { container: 'bg-track', color: '#141B2B' },
  solidPrimary: { container: 'bg-primary', color: '#FFFFFF' },
  outline: { container: 'bg-card border border-outline-soft', color: '#1D63ED' },
};

const sizes: Record<IconTileSize, { container: string; icon: number }> = {
  sm: { container: 'h-10 w-10 rounded-xl', icon: 20 },
  md: { container: 'h-11 w-11 rounded-xl', icon: 22 },
  lg: { container: 'h-12 w-12 rounded-2xl', icon: 24 },
};

type IconTileProps = {
  icon: IconName;
  tone?: IconTileTone;
  size?: IconTileSize;
  className?: string;
};

export function IconTile({ icon, tone = 'primary', size = 'md', className = '' }: IconTileProps) {
  return (
    <View
      className={`flex-shrink-0 items-center justify-center ${tones[tone].container} ${sizes[size].container} ${className}`}>
      <Icon name={icon} size={sizes[size].icon} color={tones[tone].color} />
    </View>
  );
}

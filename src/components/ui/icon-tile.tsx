import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type IconTileTone = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'glass';

type IconTileSize = 'sm' | 'md' | 'lg';

const tones: Record<IconTileTone, { container: string; color: string }> = {
  primary: { container: 'bg-primary-fixed', color: '#004BC3' },
  secondary: { container: 'bg-secondary-fixed/50', color: '#994700' },
  tertiary: { container: 'bg-tertiary-fixed/50', color: '#006242' },
  neutral: { container: 'bg-surface-container', color: '#424655' },
  glass: { container: 'bg-white/15', color: '#FFFFFF' },
};

const sizes: Record<IconTileSize, { container: string; icon: number }> = {
  sm: { container: 'h-9 w-9 rounded-lg', icon: 18 },
  md: { container: 'h-10 w-10 rounded-xl', icon: 22 },
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

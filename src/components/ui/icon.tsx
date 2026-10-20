import { MaterialIcons } from '@expo/vector-icons';

import type { IconName } from '@/types/icons';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 20, color = '#141B2B' }: IconProps) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

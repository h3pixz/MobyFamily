import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type FamilySectionHeaderProps = {
  icon: IconName;
  iconColor: string;
  title: string;
  badge: string;
  badgeClassName: string;
  badgeTextClassName?: string;
};

export function FamilySectionHeader({
  icon,
  iconColor,
  title,
  badge,
  badgeClassName,
  badgeTextClassName = 'text-on-surface-variant',
}: FamilySectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-2 px-1">
      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        <Icon name={icon} size={18} color={iconColor} />
        <Text className="text-label-md font-inter-semibold uppercase tracking-wider text-on-surface-variant">
          {title}
        </Text>
      </View>
      <View className={`rounded-full px-2 py-0.5 ${badgeClassName}`}>
        <Text className={`text-label-xs font-inter-semibold ${badgeTextClassName}`}>{badge}</Text>
      </View>
    </View>
  );
}

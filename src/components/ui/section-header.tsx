import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';

type SectionHeaderProps = {
  title: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, badge, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-1">
      <View className="flex-row items-center gap-2">
        <Text className="text-[17px] font-inter-bold text-on-surface">{title}</Text>
        {badge ? <Badge label={badge} tone="primary" /> : null}
      </View>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text className="text-[13px] font-inter-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

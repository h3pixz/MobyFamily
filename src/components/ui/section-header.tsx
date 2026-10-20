import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/badge';

type SectionHeaderProps = {
  title: string;
  badge?: string;
  badgeTone?: BadgeTone;
  trailing?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({
  title,
  badge,
  badgeTone = 'neutral',
  trailing,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row flex-wrap items-center justify-between gap-2">
      <View className="flex-row items-center gap-2">
        <Text className="text-headline-sm font-inter-semibold text-on-surface">{title}</Text>
        {badge ? <Badge label={badge} tone={badgeTone} /> : null}
      </View>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction} className="ml-auto">
          <Text className="text-label-sm font-inter-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : trailing ? (
        <View className="ml-auto">{trailing}</View>
      ) : null}
    </View>
  );
}

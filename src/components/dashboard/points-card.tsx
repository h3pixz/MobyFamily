import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import type { ParentPoints } from '@/types/dashboard';

type PointsCardProps = {
  points: ParentPoints;
  onPress: () => void;
};

export function PointsCard({ points, onPress }: PointsCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
      <Card className="flex-row items-center justify-between p-3.5">
        <View className="flex-1 flex-row items-center gap-3">
          <IconTile icon="military-tech" tone="warning" size="sm" />
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-[14px] font-inter-bold text-on-surface">
                {points.points} баллов родителя
              </Text>
              <Badge label={points.levelLabel} tone="warning" />
            </View>
            <Text className="text-[12px] font-inter text-on-surface-variant" numberOfLines={1}>
              {points.description}
            </Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#94A3B8" />
      </Card>
    </Pressable>
  );
}

import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

type AddFamilyMemberCardProps = {
  onPress: () => void;
};

export function AddFamilyMemberCard({ onPress }: AddFamilyMemberCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Добавить члена семьи"
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
      <Card className="flex-row items-center justify-between gap-space-md p-space-md">
        <View className="min-w-0 flex-1 flex-row items-center gap-space-sm">
          <View className="h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-fixed">
            <Icon name="group-add" size={24} color="#004BC3" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-headline-sm font-inter-semibold text-primary-container">
              + Добавить члена семьи
            </Text>
            <Text
              numberOfLines={1}
              className="text-body-sm font-inter text-on-surface-variant">
              Ребёнок или второй родитель с доступом
            </Text>
          </View>
        </View>

        <View className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-low">
          <Icon name="chevron-right" size={20} color="#1D63ED" />
        </View>
      </Card>
    </Pressable>
  );
}

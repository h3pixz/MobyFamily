import { Pressable, Text, View } from 'react-native';

import type { CashbackCategoriesResponseDto } from '@/api/gen/models/CashbackCategoriesResponseDto';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { formatPoints } from '@/utils/format';

type TeenCashbackCardProps = {
  categories: CashbackCategoriesResponseDto;
  mobiksBalance: number;
  monthName: string;
  onConfigure: () => void;
};

export function TeenCashbackCard({
  categories,
  mobiksBalance,
  monthName,
  onConfigure,
}: TeenCashbackCardProps) {
  const selected = categories.selectedCategories;
  const available = categories.availableCategories;

  return (
    <Card className="gap-0 p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Text className="text-body-md font-inter-bold text-on-surface">
            Кэшбэк на {monthName}
          </Text>
          <View className="rounded-full border border-primary-fixed-dim bg-primary-soft px-2 py-0.5">
            <Text className="text-[10px] font-inter-bold text-primary">x2 Мобиков</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-label-md font-inter-bold text-tertiary">
            {formatPoints(mobiksBalance)} б.
          </Text>
          <Text className="text-[10px] font-inter-medium text-outline">Мобики</Text>
        </View>
      </View>

      <Text className="mt-1.5 text-[11px] font-inter-medium text-on-surface-variant">
        Выбрано {selected.length} из {available.length} категорий повышенного кэшбэка:
      </Text>

      <View className="mt-2.5 flex-row flex-wrap gap-1.5">
        {available.map((category) => {
          const isSelected = selected.includes(category.code);

          return (
            <View
              key={category.code}
              className={`flex-row items-center gap-1 rounded-xl px-2.5 py-1.5 ${
                isSelected ? 'bg-primary-container' : 'bg-surface-low'
              }`}>
              <Text
                className={`text-[11px] font-inter-medium ${
                  isSelected ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                {category.icon} {category.name} • x{category.multiplier}
              </Text>
              {isSelected ? <Icon name="check" size={13} color="#FFFFFF" /> : null}
            </View>
          );
        })}
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-2 border-t border-outline-variant/25 pt-2.5">
        <Text className="text-[11px] font-inter-medium text-outline">Начисление 1-го числа</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Настроить категории кэшбэка"
          onPress={onConfigure}
          hitSlop={8}
          className="flex-row items-center gap-0.5"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
          <Text className="text-label-md font-inter-semibold text-primary-container">
            Настроить категории
          </Text>
          <Icon name="chevron-right" size={15} color="#1D63ED" />
        </Pressable>
      </View>
    </Card>
  );
}

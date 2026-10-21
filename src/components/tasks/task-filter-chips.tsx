import { Pressable, ScrollView, Text, View } from 'react-native';

import type { TaskFilter } from '@/types/tasks';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type TaskFilterChipsProps = {
  value: TaskFilter;
  activeCount: number;
  reviewCount: number;
  onChange: (value: TaskFilter) => void;
};

export function TaskFilterChips({
  value,
  activeCount,
  reviewCount,
  onChange,
}: TaskFilterChipsProps) {
  const filters: { key: TaskFilter; label: string; count?: number; dot?: boolean }[] = [
    { key: 'active', label: 'Активные', count: activeCount },
    { key: 'review', label: 'На проверке', count: reviewCount, dot: true },
    { key: 'done', label: 'Завершённые' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -20 }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
      {filters.map((filter) => {
        const active = filter.key === value;

        return (
          <Pressable
            key={filter.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(filter.key)}
            className={`h-9 flex-row items-center gap-1.5 whitespace-nowrap rounded-xl px-4 ${
              active ? 'bg-primary-container' : 'bg-surface-lowest'
            }`}
            style={({ pressed }) => [
              active ? undefined : shadow,
              pressed ? { opacity: 0.8 } : undefined,
            ]}>
            {filter.dot ? (
              <View className="h-2 w-2 rounded-full bg-secondary-container" />
            ) : null}
            <Text
              className={`text-label-lg font-inter-semibold ${
                active ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              {filter.label}
            </Text>
            {filter.count !== undefined ? (
              <View
                className={`h-5 min-w-5 items-center justify-center rounded-full px-1 ${
                  active ? 'bg-white/20' : 'bg-surface-container-high'
                }`}>
                <Text
                  className={`text-label-sm font-inter-semibold ${
                    active ? 'text-on-primary' : 'text-on-surface'
                  }`}>
                  {filter.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

import { Pressable, ScrollView, Text } from 'react-native';

import type { HistoryFilter } from '@/types/history';
import { HISTORY_FILTERS } from '@/utils/transactions';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type HistoryFilterChipsProps = {
  value: HistoryFilter;
  onChange: (value: HistoryFilter) => void;
};

export function HistoryFilterChips({ value, onChange }: HistoryFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -20 }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
      {HISTORY_FILTERS.map((filter) => {
        const active = filter.key === value;

        return (
          <Pressable
            key={filter.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(filter.key)}
            className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-2 ${
              active ? 'bg-primary-container' : 'bg-surface-lowest'
            }`}
            style={({ pressed }) => [
              active ? undefined : shadow,
              pressed ? { opacity: 0.8 } : undefined,
            ]}>
            <Text
              className={`text-label-md font-inter-semibold ${
                active ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              {filter.label}
            </Text>
            {filter.emoji ? <Text className="text-[13px]">{filter.emoji}</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

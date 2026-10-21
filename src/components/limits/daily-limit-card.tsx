import { Pressable, Text, View } from 'react-native';

import { LimitSlider } from '@/components/limits/limit-slider';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

const QUICK_LIMITS = [5, 15, 25, 50];

type DailyLimitCardProps = {
  value: number;
  onChange: (value: number) => void;
};

export function DailyLimitCard({ value, onChange }: DailyLimitCardProps) {
  return (
    <View className="gap-3.5 rounded-xl bg-surface-low p-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-fixed">
            <Icon name="security" size={18} color="#004BC3" />
          </View>
          <Text className="text-label-lg font-inter-semibold text-on-surface">Дневной лимит трат</Text>
        </View>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-headline-lg font-inter-bold text-primary">{formatBYN(value)}</Text>
          <Text className="text-label-md font-inter-semibold text-primary">BYN</Text>
        </View>
      </View>

      <View className="pt-1">
        <LimitSlider value={value} onChange={onChange} />
      </View>

      <View className="flex-row items-center gap-2">
        {QUICK_LIMITS.map((limit) => {
          const selected = limit === value;

          return (
            <Pressable
              key={limit}
              accessibilityRole="button"
              accessibilityLabel={`Лимит ${limit} BYN`}
              accessibilityState={{ selected }}
              onPress={() => onChange(limit)}
              className={`flex-1 rounded-full px-1 py-2 ${
                selected ? 'bg-primary-container' : 'bg-surface-lowest'
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <Text
                className={`text-center text-label-md font-inter-semibold ${
                  selected ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                {limit} BYN
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

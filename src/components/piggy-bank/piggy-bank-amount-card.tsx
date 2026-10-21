import { Pressable, Text, TextInput, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { formatBYN } from '@/utils/format';
import { formatAmountInput, parseAmountInput, sanitizeAmountInput } from '@/utils/piggy-bank';

const quickAmounts = [5, 10, 20];

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type PiggyBankAmountCardProps = {
  amount: string;
  remainingAmount: number;
  onChangeAmount: (value: string) => void;
};

export function PiggyBankAmountCard({
  amount,
  remainingAmount,
  onChangeAmount,
}: PiggyBankAmountCardProps) {
  const parsed = parseAmountInput(amount);
  const canCloseGoal = remainingAmount > 0;

  return (
    <View className="mb-3 rounded-xl bg-surface-lowest p-4" style={shadow}>
      <Text className="mb-1 text-center text-label-sm font-inter-semibold uppercase tracking-wider text-on-surface-variant">
        Сумма пополнения
      </Text>

      <View className="w-full flex-row items-baseline justify-center gap-1 py-1">
        <TextInput
          accessibilityLabel="Сумма пополнения"
          value={amount}
          onChangeText={(value) => onChangeAmount(sanitizeAmountInput(value))}
          keyboardType="decimal-pad"
          inputMode="decimal"
          maxLength={9}
          selectTextOnFocus
          placeholder="0,00"
          placeholderTextColor="#737686"
          className="w-40 bg-transparent text-center text-[36px] font-inter-bold leading-[44px] text-on-surface"
          style={{ paddingVertical: 0 }}
        />
        <BynIcon size={22} color="#191C1E" />
      </View>

      <View className="mb-4 h-0.5 w-32 self-center rounded-full bg-primary" />

      <View className="flex-row flex-wrap items-center justify-center gap-2">
        {quickAmounts.map((value) => {
          const active = parsed === value;

          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChangeAmount(formatAmountInput(value))}
              className={`rounded-full px-3.5 py-1.5 ${
                active ? 'bg-primary-fixed' : 'bg-surface-low'
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
              <Text
                className={`text-label-md ${
                  active
                    ? 'font-inter-semibold text-primary'
                    : 'font-inter-medium text-on-surface'
                }`}>
                +{value}
              </Text>
            </Pressable>
          );
        })}

        {canCloseGoal ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: parsed === remainingAmount }}
            onPress={() => onChangeAmount(formatAmountInput(remainingAmount))}
            className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
              parsed === remainingAmount ? 'bg-secondary-fixed-dim' : 'bg-secondary-fixed'
            }`}
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
            <Text className="text-label-md font-inter-semibold text-on-secondary-fixed">
              Закрыть цель ({formatBYN(remainingAmount)})
            </Text>
            <Text className="text-xs">🎯</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

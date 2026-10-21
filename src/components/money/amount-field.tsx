import { Text, TextInput, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { sanitizeAmountInput } from '@/utils/piggy-bank';

type AmountFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  error?: string | null;
};

export function AmountField({
  value,
  onChange,
  label = 'Сумма',
  hint,
  error,
}: AmountFieldProps) {
  return (
    <View className="gap-2 rounded-xl bg-surface-low p-4">
      <Text className="text-label-sm font-inter-semibold text-on-surface-variant">{label}</Text>

      <View className="flex-row items-center gap-2">
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={(next) => onChange(sanitizeAmountInput(next))}
          keyboardType="decimal-pad"
          inputMode="decimal"
          placeholder="0,00"
          placeholderTextColor="#737686"
          className="min-w-0 flex-1 bg-transparent p-0 text-headline-lg font-inter-bold text-on-surface"
        />
        <BynIcon size={16} color="#004BC3" />
      </View>

      {error ? (
        <View className="flex-row items-center gap-1.5">
          <Icon name="error-outline" size={14} color="#BA1A1A" />
          <Text className="flex-1 text-label-sm font-inter text-error">{error}</Text>
        </View>
      ) : hint ? (
        <Text className="text-label-sm font-inter text-on-surface-variant">{hint}</Text>
      ) : null}
    </View>
  );
}

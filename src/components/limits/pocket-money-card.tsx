import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { getPocketMoneySchedule, POCKET_MONEY_DAYS } from '@/utils/limits';
import { sanitizeAmountInput } from '@/utils/piggy-bank';

type PocketMoneyCardProps = {
  amount: string;
  day: number;
  onChangeAmount: (value: string) => void;
  onChangeDay: (value: number) => void;
};

export function PocketMoneyCard({
  amount,
  day,
  onChangeAmount,
  onChangeDay,
}: PocketMoneyCardProps) {
  return (
    <View className="gap-3.5 rounded-xl bg-surface-low p-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-secondary-fixed">
            <Icon name="paid" size={18} color="#994700" />
          </View>
          <View>
            <Text className="text-label-lg font-inter-semibold text-on-surface">Карманные деньги</Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              Регулярный автоперевод
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-secondary-container/15 px-2 py-0.5">
          <View className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
          <Text className="text-label-sm font-inter-semibold text-secondary">Активно</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between rounded-xl bg-surface-lowest px-4 py-3">
        <View className="min-w-0 flex-1">
          <Text className="text-label-sm font-inter text-on-surface-variant">Сумма выплаты</Text>
          <View className="mt-0.5 flex-row items-baseline gap-1">
            <TextInput
              accessibilityLabel="Сумма карманных в неделю"
              value={amount}
              onChangeText={(value) => onChangeAmount(sanitizeAmountInput(value))}
              keyboardType="decimal-pad"
              inputMode="decimal"
              placeholder="0,00"
              placeholderTextColor="#737686"
              className="w-24 bg-transparent p-0 text-headline-md font-inter-semibold text-on-surface"
            />
            <Text className="text-label-md font-inter-semibold text-on-surface-variant">BYN</Text>
          </View>
        </View>
        <Icon name="edit" size={20} color="#004BC3" />
      </View>

      <View className="gap-2">
        <Text className="text-label-sm font-inter text-on-surface-variant">
          День недели для начисления:
        </Text>
        <View className="flex-row items-center gap-1">
          {POCKET_MONEY_DAYS.map((item) => {
            const selected = item.value === day;

            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityLabel={`${item.short}, ${item.schedule}`}
                accessibilityState={{ selected }}
                onPress={() => onChangeDay(item.value)}
                className={`flex-1 rounded-lg py-2 ${
                  selected ? 'bg-primary-container' : 'bg-surface-lowest'
                }`}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <Text
                  className={`text-center text-label-md font-inter-semibold ${
                    selected ? 'text-on-primary' : 'text-on-surface'
                  }`}>
                  {item.short}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="mt-0.5 flex-row items-center gap-1.5">
          <Icon name="schedule" size={15} color="#004BC3" />
          <Text className="text-body-sm font-inter text-on-surface-variant">
            Каждую неделю по {getPocketMoneySchedule(day)} в 09:00
          </Text>
        </View>
      </View>
    </View>
  );
}

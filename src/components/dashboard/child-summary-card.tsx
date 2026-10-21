import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ChildProfile } from '@/types/dashboard';
import { formatBYN, pluralize } from '@/utils/format';

type ChildSummaryCardProps = {
  child: ChildProfile;
  savingsBalance: number;
  activeGoals: number;
  onPressPocketMoney: () => void;
  onPressHistory: () => void;
};

export function ChildSummaryCard({
  child,
  savingsBalance,
  activeGoals,
  onPressPocketMoney,
  onPressHistory,
}: ChildSummaryCardProps) {
  const dailyRemaining = child.dailyLimit - child.dailySpent;
  const goalsLabel = pluralize(activeGoals, [
    'активная цель',
    'активные цели',
    'активных целей',
  ]);

  return (
    <BankCard colors={['#1D63ED', '#1D63ED']}>
      <View className="gap-3.5">
        <View className="flex-row flex-wrap items-start justify-between gap-2">
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-[17px] font-inter-bold leading-tight text-white">
                {child.name}, {child.age} лет
              </Text>
              <Icon name="verified-user" size={16} color="#FFFFFF" />
            </View>
            <Text className="text-[12px] font-inter-medium text-white/80">
              Детская карта •• {child.cardLast4}
            </Text>
          </View>
          <View className="rounded-full bg-success-soft px-2.5 py-1">
            <Text className="text-[11px] font-inter-bold text-success">{child.ageGroup}</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-1 rounded-xl border border-white/10 bg-white/10 p-2.5">
            <View className="flex-row flex-wrap items-center justify-between gap-1">
              <Text className="text-[11px] font-inter leading-tight text-white/80">Для покупок</Text>
              <View className="flex-row items-center gap-1 rounded bg-success-soft/20 px-1.5 py-0.5">
                <View className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim" />
                <Text className="text-[10px] font-inter text-white">Активна</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1 pt-0.5">
              <Text className="text-[24px] font-inter-bold tracking-tight text-white">
                {formatBYN(child.purchaseBalance)}
              </Text>
              <BynIcon size={10} color="#FFFFFF" style={{ marginTop: 4 }} />
            </View>
            <Text className="text-[10px] font-inter text-white/70">Можно потратить</Text>
          </View>

          <View className="flex-1 gap-1 rounded-xl border border-white/10 bg-white/10 p-2.5">
            <View className="flex-row items-center justify-between gap-1">
              <Text className="text-[11px] font-inter leading-tight text-white/80">В копилке</Text>
              <Icon name="savings" size={16} color="rgba(255,255,255,0.8)" />
            </View>
            <View className="flex-row items-center gap-1 pt-0.5">
              <Text className="text-[24px] font-inter-bold tracking-tight text-white">
                {formatBYN(savingsBalance)}
              </Text>
              <BynIcon size={10} color="#FFFFFF" style={{ marginTop: 4 }} />
            </View>
            <Text className="text-[10px] font-inter text-white/70">
              {activeGoals} {goalsLabel}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-lg bg-black/15 px-3 py-1.5">
            <View className="flex-row flex-wrap items-center gap-1.5">
              <Icon name="speed" size={15} color="#FFFFFF" />
              <Text className="text-[12px] font-inter-medium text-white/90">
                Дневной лимит: {formatBYN(child.dailySpent)} из {formatBYN(child.dailyLimit)}
              </Text>
              <BynIcon size={9} color="#FFFFFF" style={{ marginHorizontal: 1 }} />
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-[12px] font-inter-semibold text-white">
                Остаток {formatBYN(dailyRemaining)}
              </Text>
              <BynIcon size={9} color="#FFFFFF" />
            </View>
          </View>

          <View className="flex-row flex-wrap items-center justify-between gap-2 px-1">
            <View className="flex-row flex-wrap items-center gap-1">
              <Icon name="calendar-today" size={14} color="rgba(255,255,255,0.8)" />
              <Text className="text-[11px] font-inter text-white/80">
                Карманные: {child.pocketMoney}
              </Text>
              <BynIcon size={8} color="rgba(255,255,255,0.8)" />
              <Text className="text-[11px] font-inter text-white/80">
                в неделю ({child.pocketMoneySchedule})
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Настроить карманные"
              hitSlop={8}
              onPress={onPressPocketMoney}
              className="py-1">
              <Text className="text-[11px] font-inter-medium text-white underline">Настроить</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="История операций"
          onPress={onPressHistory}
          className="flex-row items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/15 py-2.5"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
          <Icon name="receipt-long" size={16} color="#FFFFFF" />
          <Text className="text-[13px] font-inter-semibold text-white">История</Text>
        </Pressable>
      </View>
    </BankCard>
  );
}

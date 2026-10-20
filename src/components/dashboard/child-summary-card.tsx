import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ChildProfile } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type ChildSummaryCardProps = {
  child: ChildProfile;
};

export function ChildSummaryCard({ child }: ChildSummaryCardProps) {
  return (
    <BankCard colors={['#1D63ED', '#2B73FA']}>
      <View className="gap-4">
        <View className="flex-row items-start justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
            <View className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Text className="text-label-lg font-inter-bold text-white">{child.initials}</Text>
            </View>
            <View className="min-w-0 flex-1">
              <View className="flex-row flex-wrap items-center gap-1.5">
                <Text className="text-label-lg font-inter-bold text-white">
                  {child.name}, {child.age} лет
                </Text>
                <Badge label={child.ageGroup} tone="glass" />
              </View>
              <Text className="text-label-sm font-inter-medium text-white/80">
                Детская карта · •• {child.cardLast4}
              </Text>
            </View>
          </View>
          <View className="items-center justify-center rounded-lg bg-white/15 px-2 py-1">
            <Icon name="contactless" size={16} color="#FFFFFF" />
          </View>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1 gap-0.5 rounded-xl bg-white/10 p-2.5">
            <Text className="text-label-sm font-inter-medium text-white/80">Можно потратить</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[22px] font-inter-bold tracking-tight text-white">
                {formatBYN(child.purchaseBalance)}
              </Text>
              <BynIcon size={10} color="#FFFFFF" style={{ marginTop: 4 }} />
            </View>
          </View>
          <View className="flex-1 gap-0.5 rounded-xl bg-white/10 p-2.5">
            <Text className="text-label-sm font-inter-medium text-white/80">В копилке</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[22px] font-inter-bold tracking-tight text-white">
                {formatBYN(child.savingsBalance)}
              </Text>
              <BynIcon size={10} color="#FFFFFF" style={{ marginTop: 4 }} />
            </View>
          </View>
        </View>

        <View className="gap-1 border-t border-white/20 pt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-label-md font-inter-medium text-white/80">Дневной лимит</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-label-md font-inter-semibold text-white">
                {formatBYN(child.dailySpent)} из {formatBYN(child.dailyLimit)}
              </Text>
              <BynIcon size={9} color="#FFFFFF" />
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-label-md font-inter-medium text-white/80">Карманные</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-label-md font-inter-semibold text-white">{child.pocketMoney}</Text>
              <BynIcon size={9} color="#FFFFFF" />
              <Text className="text-label-md font-inter-medium text-white/80">
                в неделю ({child.pocketMoneySchedule})
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BankCard>
  );
}

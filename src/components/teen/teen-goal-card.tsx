import { Text, View } from 'react-native';

import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatBYN, pluralize } from '@/utils/format';
import { getMonthsUntilDate } from '@/utils/teen';

type TeenGoalCardProps = {
  piggyBank: PiggyBankResponseDto;
  activeCount: number;
  onAddMoney: () => void;
};

export function TeenGoalCard({ piggyBank, activeCount, onAddMoney }: TeenGoalCardProps) {
  const description = typeof piggyBank.description === 'string' ? piggyBank.description : null;
  const targetDate = typeof piggyBank.targetDate === 'string' ? piggyBank.targetDate : null;
  const monthsLeft = getMonthsUntilDate(targetDate);

  return (
    <Card className="p-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-body-md font-inter-bold text-on-surface">Копилка</Text>
        <View className="rounded-full bg-surface-container px-2 py-0.5">
          <Text className="text-[10px] font-inter-semibold text-on-surface-variant">
            {activeCount} {pluralize(activeCount, ['активная цель', 'активные цели', 'активных целей'])}
          </Text>
        </View>
      </View>

      <View className="mt-3 rounded-2xl border border-outline-variant/20 bg-surface-low p-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
            <View className="h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
              <Text className="text-base">💻</Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-label-md font-inter-bold text-on-surface">
                {piggyBank.title}
              </Text>
              <Text numberOfLines={1} className="mt-0.5 text-[10px] font-inter-medium text-outline">
                {description ?? 'Копилка мечты'}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <View className="flex-row items-center gap-1">
              <Text className="text-label-md font-inter-bold text-on-surface">
                {formatBYN(piggyBank.currentAmount)}
              </Text>
              <Text className="text-[10px] font-inter-medium text-outline">/</Text>
              <Text className="text-[10px] font-inter-medium text-outline">
                {formatBYN(piggyBank.targetAmount)}
              </Text>
              <BynIcon size={8} color="#737686" />
            </View>
            <Text className="text-[10px] font-inter-semibold text-primary-container">
              {piggyBank.progressPercentage}%
            </Text>
          </View>
        </View>

        <View className="mt-2.5">
          <ProgressBar value={piggyBank.progressPercentage / 100} heightClassName="h-1.5" />
        </View>

        <View className="mt-2.5 flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-[11px] font-inter-medium text-on-surface-variant">
                Осталось {formatBYN(piggyBank.remainingAmount)}
              </Text>
              <BynIcon size={8} color="#424655" />
            </View>
            {monthsLeft > 0 ? (
              <Text className="mt-0.5 text-[10px] font-inter-medium text-outline">
                ~{monthsLeft} {pluralize(monthsLeft, ['месяц', 'месяца', 'месяцев'])}
              </Text>
            ) : null}
          </View>
          <Button
            label="+ Пополнить"
            size="sm"
            className="flex-shrink-0 rounded-lg"
            onPress={onAddMoney}
          />
        </View>
      </View>
    </Card>
  );
}

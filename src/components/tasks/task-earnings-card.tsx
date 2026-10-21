import { Text, View } from 'react-native';

import { BankCard } from '@/components/dashboard/bank-card';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

type TaskEarningsCardProps = {
  earned: number;
  completed: number;
  total: number;
  percent: number;
};

export function TaskEarningsCard({ earned, completed, total, percent }: TaskEarningsCardProps) {
  return (
    <BankCard colors={['#1D63ED', '#004BC3']} padding={16}>
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Icon name="savings" size={24} color="#FFFFFF" />
        </View>
        <View>
          <Text className="text-label-md font-inter-semibold uppercase tracking-wider text-primary-fixed">
            Заработок за месяц
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-headline-lg font-inter-bold tracking-tight text-on-primary">
              {formatBYN(earned)}
            </Text>
            <BynIcon size={13} color="rgba(255,255,255,0.85)" />
          </View>
        </View>
      </View>

      <View className="mt-4 gap-1.5 border-t border-white/10 pt-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-label-sm font-inter-medium text-on-primary-container">
            {total > 0 ? `Выполнено ${completed} из ${total} заданий` : 'Заданий пока нет'}
          </Text>
          <Text className="text-label-sm font-inter-bold text-white">{percent}%</Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-black/20">
          <View
            className="h-full rounded-full bg-white"
            style={{ width: `${percent}%` }}
          />
        </View>
      </View>
    </BankCard>
  );
}

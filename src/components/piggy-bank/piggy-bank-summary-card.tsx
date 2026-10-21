import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';
import { getGoalEmoji } from '@/utils/piggy-bank';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type PiggyBankSummaryCardProps = {
  piggyBank: PiggyBankResponseDto;
  weeklyDelta: number;
};

export function PiggyBankSummaryCard({ piggyBank, weeklyDelta }: PiggyBankSummaryCardProps) {
  const percent = Math.min(100, Math.max(0, piggyBank.progressPercentage));

  return (
    <View className="mb-3 rounded-xl bg-surface-low p-4">
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View
            className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-lowest"
            style={shadow}>
            <Text className="text-xl">{getGoalEmoji(piggyBank.title)}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-headline-sm font-inter-semibold text-on-surface">
              {piggyBank.title}
            </Text>
            <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
              {typeof piggyBank.description === 'string' && piggyBank.description
                ? piggyBank.description
                : 'Копилка мечты'}
            </Text>
          </View>
        </View>

        <View className="flex-shrink-0 flex-row items-center gap-1 rounded-full bg-secondary-fixed px-2.5 py-1">
          <Text className="text-label-sm font-inter-semibold text-on-secondary-fixed">
            Осталось {formatBYN(piggyBank.remainingAmount)}
          </Text>
          <BynIcon size={8} color="#321200" />
        </View>
      </View>

      <View className="mb-2 flex-row items-baseline justify-between gap-2">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-headline-md font-inter-bold text-on-surface">
            {formatBYN(piggyBank.currentAmount)}
          </Text>
          <BynIcon size={11} color="#191C1E" />
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-body-sm font-inter text-on-surface-variant">из</Text>
          <Text className="text-body-sm font-inter text-on-surface-variant">
            {formatBYN(piggyBank.targetAmount)}
          </Text>
          <BynIcon size={9} color="#424655" />
        </View>
      </View>

      <View className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
        <LinearGradient
          colors={['#FB7800', '#1D63ED']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-full rounded-full"
          style={{ width: `${percent}%` }}
        />
      </View>

      <View className="mt-2 flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-label-sm font-inter text-on-surface-variant">
          Выполнено {percent}%
        </Text>
        <View className="flex-row items-center gap-0.5">
          <Icon name="trending-up" size={14} color="#1D63ED" />
          <Text className="text-label-sm font-inter-medium text-primary">
            +{formatBYN(weeklyDelta)}
          </Text>
          <BynIcon size={8} color="#004BC3" />
          <Text className="text-label-sm font-inter-medium text-primary">за неделю</Text>
        </View>
      </View>
    </View>
  );
}

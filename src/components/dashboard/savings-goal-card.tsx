import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { SavingsGoal } from '@/types/dashboard';
import { formatBYN, formatPercent } from '@/utils/format';

type SavingsGoalCardProps = {
  goal: SavingsGoal;
  onAddMoney: () => void;
};

export function SavingsGoalCard({ goal, onAddMoney }: SavingsGoalCardProps) {
  const percent = formatPercent(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;

  return (
    <Card className="gap-space-sm p-space-md">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          <IconTile icon="savings" tone="primary" size="md" />
          <View className="min-w-0 flex-1">
            <View className="flex-row flex-wrap items-center gap-1.5">
              <Text className="text-headline-sm font-inter-semibold text-on-surface">
                {goal.title}
              </Text>
              <View className="flex-row items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5">
                <Text className="text-label-xs font-inter-bold text-tertiary">
                  +{formatBYN(goal.weeklyDelta)}
                </Text>
                <BynIcon size={8} color="#006242" />
                <Text className="text-label-xs font-inter-bold text-tertiary">за неделю</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-body-sm text-outline">
                {formatBYN(goal.saved)} / {formatBYN(goal.target)}
              </Text>
              <BynIcon size={9} color="#737686" style={{ marginHorizontal: 2 }} />
              <Text className="text-body-sm text-outline">({percent}%)</Text>
            </View>
          </View>
        </View>
        <Badge label={`${percent}%`} tone="primary" />
      </View>

      <ProgressBar value={goal.saved / goal.target} />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Text className="text-label-sm font-inter-medium text-outline">Осталось {formatBYN(remaining)}</Text>
          <BynIcon size={9} color="#737686" />
        </View>
        <Text className="text-label-sm font-inter-semibold text-primary">
          ~{goal.monthsLeft} месяца
        </Text>
      </View>

      <Button
        label="Пополнить цель"
        icon="add"
        variant="soft"
        className="w-full"
        onPress={onAddMoney}
      />
    </Card>
  );
}

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
    <Card className="gap-3 p-space-md">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          <IconTile icon={goal.icon} tone="primary" size="md" />
          <View className="min-w-0 flex-1">
            <Text className="text-headline-sm font-inter-bold leading-tight text-on-surface">
              {goal.title}
            </Text>
            <Text className="text-[12px] leading-4 text-outline">{goal.deadline}</Text>
          </View>
        </View>
        <View className="flex-shrink-0 items-end">
          <Badge label={`${percent}%`} tone="success" />
          <View className="flex-row items-center pt-0.5">
            <Text className="text-[12px] text-outline">{formatBYN(goal.saved)} / </Text>
            <Text className="text-[12px] text-outline">{formatBYN(goal.target)}</Text>
            <BynIcon size={9} color="#737686" style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>

      <ProgressBar value={goal.saved / goal.target} heightClassName="h-2.5" />

      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <View className="flex-row flex-wrap items-center">
          <Text className="text-[12px] font-inter-medium text-on-surface-variant">
            +{formatBYN(goal.weeklyDelta)}
          </Text>
          <BynIcon size={9} color="#424655" style={{ marginHorizontal: 2 }} />
          <Text className="text-[12px] font-inter-medium text-on-surface-variant">
            за неделю · Осталось {formatBYN(remaining)}
          </Text>
          <BynIcon size={9} color="#424655" style={{ marginHorizontal: 2 }} />
        </View>
        <Text className="text-[12px] font-inter-semibold text-primary-container">
          ~{goal.monthsLeft} месяца
        </Text>
      </View>

      <Button
        label="Пополнить цель"
        icon="add"
        variant="soft"
        className="w-full rounded-xl"
        onPress={onAddMoney}
      />
    </Card>
  );
}

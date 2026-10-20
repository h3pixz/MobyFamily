import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { SavingsGoal } from '@/types/dashboard';
import { formatPercent } from '@/utils/format';

type SavingsGoalCardProps = {
  goal: SavingsGoal;
  onAddMoney: () => void;
};

export function SavingsGoalCard({ goal, onAddMoney }: SavingsGoalCardProps) {
  const percent = formatPercent(goal.saved, goal.target);

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-3">
          <IconTile icon="smartphone" tone="primary" size="md" />
          <View className="flex-1">
            <View className="flex-row flex-wrap items-center gap-2">
              <Text className="text-[16px] font-inter-bold text-on-surface">{goal.title}</Text>
              <Badge label={`${percent}%`} tone="accent" />
            </View>
            <Text className="text-[12px] font-inter text-on-surface-variant">{goal.subtitle}</Text>
          </View>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-[17px] font-inter-bold text-on-surface">{goal.saved}</Text>
          <Text className="text-[12px] font-inter-medium text-on-surface-variant">
            {' '}
            / {goal.target} BYN
          </Text>
        </View>
      </View>

      <ProgressBar value={goal.saved / goal.target} />

      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1">
          <Icon name="arrow-upward" size={15} color="#10B981" />
          <Text className="text-[12px] font-inter-semibold text-accent">
            +{goal.weeklyDelta} BYN за неделю
          </Text>
        </View>
        <Text className="text-[12px] font-inter-medium text-on-surface-variant">
          Осталось {goal.target - goal.saved} BYN
        </Text>
      </View>

      <Button
        label="Пополнить цель"
        icon="add-circle"
        variant="accent"
        className="w-full"
        onPress={onAddMoney}
      />
    </Card>
  );
}

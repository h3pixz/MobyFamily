import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { SavingsGoal } from '@/types/dashboard';
import { formatBYN, formatPercent } from '@/utils/format';

type ChildGoalCardProps = {
  goal: SavingsGoal;
  onAddMoney: () => void;
};

export function ChildGoalCard({ goal, onAddMoney }: ChildGoalCardProps) {
  const percent = formatPercent(goal.saved, goal.target);
  const remaining = goal.target - goal.saved;

  return (
    <Card className="gap-space-sm p-margin">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          <IconTile icon={goal.icon} tone="primary" />
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="text-headline-sm font-inter-semibold leading-tight text-on-surface">
              {goal.title}
            </Text>
            <Text className="text-body-sm font-inter text-on-surface-variant">{goal.subtitle}</Text>
          </View>
        </View>
        <View className="flex-shrink-0 rounded-full bg-primary-fixed px-2.5 py-1">
          <Text className="text-label-sm font-inter-bold text-primary">{percent}%</Text>
        </View>
      </View>

      <View className="gap-1.5 pt-1">
        <View className="flex-row flex-wrap items-baseline justify-between gap-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-label-lg font-inter-bold text-on-surface">
              {formatBYN(goal.saved)}
            </Text>
            <BynIcon size={10} color="#191C1E" />
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-body-sm font-inter-medium text-on-surface-variant">из</Text>
            <Text className="text-body-sm font-inter-medium text-on-surface-variant">
              {formatBYN(goal.target)}
            </Text>
            <BynIcon size={9} color="#424655" />
          </View>
        </View>

        <ProgressBar value={goal.saved / goal.target} heightClassName="h-2.5" />

        <View className="flex-row flex-wrap items-center justify-between gap-2 pt-0.5">
          <View className="flex-row items-center gap-1">
            <Text className="text-label-sm font-inter text-on-surface-variant">
              Осталось накопить {formatBYN(remaining)}
            </Text>
            <BynIcon size={8} color="#424655" />
          </View>
          <View className="flex-row items-center gap-0.5">
            <Icon name="trending-up" size={14} color="#006242" />
            <Text className="text-label-sm font-inter-semibold text-tertiary">
              +{formatBYN(goal.weeklyDelta)}
            </Text>
            <BynIcon size={8} color="#006242" />
            <Text className="text-label-sm font-inter-semibold text-tertiary">за неделю</Text>
          </View>
        </View>
      </View>

      <Button
        label="Добавить в копилку"
        icon="add-circle"
        variant="soft"
        size="lg"
        className="w-full rounded-xl"
        onPress={onAddMoney}
      />
    </Card>
  );
}

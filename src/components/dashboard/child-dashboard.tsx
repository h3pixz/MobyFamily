import { Text, View } from 'react-native';

import { ChildSummaryCard } from '@/components/dashboard/child-summary-card';
import { DecisionsSection } from '@/components/dashboard/decisions-section';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { SavingsGoalCard } from '@/components/dashboard/savings-goal-card';
import { TasksSection } from '@/components/dashboard/tasks-section';
import type {
  ChildProfile,
  DecisionRequest,
  QuickActionItem,
  SavingsGoal,
  Task,
} from '@/types/dashboard';

type ChildDashboardProps = {
  child: ChildProfile;
  decisions: DecisionRequest[];
  tasks: Task[];
  goal: SavingsGoal;
  cardSettings: QuickActionItem[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onPressAction: (label: string) => void;
  onNewTask: () => void;
  onAddMoney: () => void;
};

export function ChildDashboard({
  child,
  decisions,
  tasks,
  goal,
  cardSettings,
  onApprove,
  onDecline,
  onPressAction,
  onNewTask,
  onAddMoney,
}: ChildDashboardProps) {
  return (
    <View className="gap-space-md">
      <View className="flex-row items-center justify-between gap-2 px-0.5 pt-1">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <View className="h-2.5 w-2.5 rounded-full bg-tertiary" />
          <Text
            className="text-label-md font-inter-medium text-on-surface"
            numberOfLines={1}>
            Связь с картой ребёнка: онлайн
          </Text>
        </View>
        <Text className="flex-shrink-0 text-label-sm font-inter-medium text-outline">
          Обновлено сейчас
        </Text>
      </View>

      <ChildSummaryCard child={child} />
      <DecisionsSection requests={decisions} onApprove={onApprove} onDecline={onDecline} />
      <QuickActions
        title="Быстрые настройки карты"
        actions={cardSettings}
        onPress={onPressAction}
      />
      <TasksSection tasks={tasks} onNewTask={onNewTask} />
      <SavingsGoalCard goal={goal} onAddMoney={onAddMoney} />
    </View>
  );
}

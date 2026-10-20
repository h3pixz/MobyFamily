import { Text, View } from 'react-native';

import { ChildSummaryCard } from '@/components/dashboard/child-summary-card';
import { DecisionsSection } from '@/components/dashboard/decisions-section';
import { SavingsGoalCard } from '@/components/dashboard/savings-goal-card';
import { TasksSection } from '@/components/dashboard/tasks-section';
import type { ChildProfile, DecisionRequest, SavingsGoal, Task } from '@/types/dashboard';

type ChildDashboardProps = {
  greeting: string;
  child: ChildProfile;
  decisions: DecisionRequest[];
  tasks: Task[];
  goal: SavingsGoal;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onPressAction: (label: string) => void;
  onNewTask: () => void;
  onAddMoney: () => void;
};

export function ChildDashboard({
  greeting,
  child,
  decisions,
  tasks,
  goal,
  onApprove,
  onDecline,
  onPressAction,
  onNewTask,
  onAddMoney,
}: ChildDashboardProps) {
  return (
    <View className="gap-space-md">
      <View className="px-0.5 pt-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-headline-sm font-inter-semibold text-on-surface">{greeting}</Text>
          <Text className="text-[16px]">✨</Text>
        </View>
      </View>

      <ChildSummaryCard
        child={child}
        onPressPocketMoney={() => onPressAction('Настройка карманных')}
        onPressHistory={() => onPressAction('История')}
      />
      <DecisionsSection requests={decisions} onApprove={onApprove} onDecline={onDecline} />
      <TasksSection tasks={tasks} onNewTask={onNewTask} />
      <SavingsGoalCard goal={goal} onAddMoney={onAddMoney} />
    </View>
  );
}

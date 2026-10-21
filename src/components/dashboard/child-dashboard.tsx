import { View } from 'react-native';

import { ChildSummaryCard } from '@/components/dashboard/child-summary-card';
import { DecisionsSection } from '@/components/dashboard/decisions-section';
import { SavingsGoalCard } from '@/components/dashboard/savings-goal-card';
import { TasksSection } from '@/components/dashboard/tasks-section';
import type { ChildProfile, DecisionRequest, SavingsGoal, Task } from '@/types/dashboard';

type ChildDashboardProps = {
  child: ChildProfile;
  savingsBalance: number;
  activeGoals: number;
  decisions: DecisionRequest[];
  tasks: Task[];
  goal: SavingsGoal | null;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  onPressHistory: () => void;
  onPressPocketMoney: () => void;
  onNewTask: () => void;
  onAddMoney: () => void;
};

export function ChildDashboard({
  child,
  savingsBalance,
  activeGoals,
  decisions,
  tasks,
  goal,
  onApprove,
  onDecline,
  onPressHistory,
  onPressPocketMoney,
  onNewTask,
  onAddMoney,
}: ChildDashboardProps) {
  return (
    <View className="gap-space-md">
      <ChildSummaryCard
        child={child}
        savingsBalance={savingsBalance}
        activeGoals={activeGoals}
        onPressPocketMoney={onPressPocketMoney}
        onPressHistory={onPressHistory}
      />
      <DecisionsSection
        requests={decisions}
        childName={child.name}
        onApprove={onApprove}
        onDecline={onDecline}
      />
      <TasksSection tasks={tasks} childName={child.name} onNewTask={onNewTask} />
      {goal ? <SavingsGoalCard goal={goal} onAddMoney={onAddMoney} /> : null}
    </View>
  );
}

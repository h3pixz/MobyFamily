import type { IconName } from '@/types/icons';

export type AppRole = 'parent' | 'child';

export type TaskStatus = 'pending' | 'in_progress';

export type Reward = { kind: 'money'; amount: number } | { kind: 'points'; amount: number };

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  reward: Reward;
  status: TaskStatus;
}

export interface ParentProfile {
  name: string;
  greeting: string;
  roleLabel: string;
}

export interface ParentCard {
  title: string;
  last4: string;
  balance: number;
}

export interface ChildProfile {
  name: string;
  initials: string;
  age: number;
  ageGroup: string;
  cardLast4: string;
  purchaseBalance: number;
  savingsBalance: number;
  activeGoals: number;
  dailyLimit: number;
  dailySpent: number;
  pocketMoney: number;
  pocketMoneySchedule: string;
}

export type FamilyMemberKind = 'child' | 'parent';

export interface FamilyMember {
  id: string;
  kind: FamilyMemberKind;
  name: string;
  roleLabel: string;
  emoji: string;
  age?: number;
  balance?: number;
}

export interface BonusMember {
  id: string;
  kind: FamilyMemberKind;
  name: string;
  roleLabel?: string;
  emoji?: string;
  points: number;
  goal?: number;
}

export type AccountTone = 'primary' | 'tertiary';

export interface Account {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  note?: string;
  delta?: number;
  icon: IconName;
  tone: AccountTone;
}

export type ActionTone = 'primary' | 'secondary' | 'tertiary';

export interface QuickActionItem {
  id: string;
  label: string;
  icon: IconName;
  tone: ActionTone;
}

export type ChildActionTone = 'primary' | 'secondary' | 'accent';

export interface ChildQuickAction {
  id: string;
  label: string;
  icon: IconName;
  tone: ChildActionTone;
}

export type DecisionKind = 'purchase' | 'task';

export interface DecisionRequest {
  id: string;
  kind: DecisionKind;
  title: string;
  subtitle: string;
  amount: number;
  icon: IconName;
  note: string;
  noteAmount?: number;
  noteDetail?: string;
  available?: number;
  hint?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  icon: IconName;
  deadline: string;
  saved: number;
  target: number;
  weeklyDelta: number;
  monthsLeft: number;
}

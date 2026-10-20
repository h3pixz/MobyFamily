import type { IconName } from '@/types/icons';

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

export type EventTone = 'success' | 'neutral' | 'primary';

export interface ActivityEvent {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tone: EventTone;
  trailing: Reward;
}

export interface ParentProfile {
  name: string;
  greeting: string;
  avatarUrl: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  ageGroup: string;
  cardLast4: string;
  avatarUrl: string;
  purchaseBalance: number;
  savingsBalance: number;
  activeGoals: number;
  dailyLimit: number;
  dailySpent: number;
  pocketMoney: number;
  pocketMoneySchedule: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  subtitle: string;
  saved: number;
  target: number;
  weeklyDelta: number;
}

export interface ParentPoints {
  points: number;
  levelLabel: string;
  description: string;
}

export interface PendingPurchase {
  id: string;
  title: string;
  merchant: string;
  amount: number;
  dailyLimit: number;
  available: number;
  scenario: string;
}

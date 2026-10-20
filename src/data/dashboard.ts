import type {
  Account,
  ChildProfile,
  DecisionRequest,
  ParentCard,
  ParentProfile,
  QuickActionItem,
  SavingsGoal,
  Task,
} from '@/types/dashboard';

export const parentProfile: ParentProfile = {
  name: 'Анна',
  greeting: 'Доброе утро, Анна',
  roleLabel: 'Личный кабинет родителя',
};

export const parentCard: ParentCard = {
  title: 'Mastercard Platinum',
  last4: '7719',
  balance: 3420.5,
};

export const childProfile: ChildProfile = {
  name: 'Саша',
  initials: 'СМ',
  age: 12,
  ageGroup: '7–13 лет (под присмотром)',
  cardLast4: '4821',
  purchaseBalance: 42,
  savingsBalance: 180,
  dailyLimit: 15,
  dailySpent: 0,
  pocketMoney: 25,
  pocketMoneySchedule: 'в пн',
};

export const accounts: Account[] = [
  {
    id: 'account-deposit',
    title: 'Накопительный счет «Доходный»',
    subtitle: 'МТБанк · 9.5% годовых',
    amount: 12500,
    delta: 98.4,
    icon: 'savings',
    tone: 'tertiary',
  },
  {
    id: 'account-salary',
    title: 'Зарплатная карта',
    subtitle: 'Visa Gold · •• 1042',
    amount: 860.2,
    note: 'Основная',
    icon: 'credit-card',
    tone: 'primary',
  },
];

export const quickPayments: QuickActionItem[] = [
  { id: 'payment-erip', label: 'ЕРИП', icon: 'account-balance-wallet', tone: 'primary' },
  { id: 'payment-mobile', label: 'Мобильная связь', icon: 'phone-android', tone: 'secondary' },
  { id: 'payment-by-number', label: 'По номеру', icon: 'send-to-mobile', tone: 'tertiary' },
];

export const cardSettings: QuickActionItem[] = [
  { id: 'setting-limit', label: 'Изменить лимит', icon: 'tune', tone: 'primary' },
  { id: 'setting-pause', label: 'Пауза карты', icon: 'pause-circle', tone: 'secondary' },
  { id: 'setting-pocket-money', label: 'Выдать карманные', icon: 'payments', tone: 'tertiary' },
];

export const initialDecisions: DecisionRequest[] = [
  {
    id: 'decision-purchase',
    kind: 'purchase',
    title: 'Саша просит одобрить покупку',
    subtitle: 'Книжный магазин',
    amount: 18,
    icon: 'menu-book',
    note: 'Превышен дневной лимит',
    noteAmount: 15,
  },
  {
    id: 'decision-task',
    kind: 'task',
    title: 'Помочь с покупками к ужину',
    subtitle: 'Саша отметил выполнено',
    amount: 5,
    icon: 'shopping-cart',
    note: 'Ждёт подтверждения',
    noteDetail: 'Чек прикреплен',
  },
];

export const childTasks: Task[] = [
  {
    id: 'task-room',
    title: 'Убраться в комнате',
    subtitle: 'Срок: сегодня до 19:00',
    icon: 'cleaning-services',
    reward: { kind: 'points', amount: 10 },
    status: 'in_progress',
  },
];

export const savingsGoal: SavingsGoal = {
  id: 'goal-phone',
  title: 'Новый телефон',
  saved: 180,
  target: 600,
  weeklyDelta: 15,
  monthsLeft: 4,
};

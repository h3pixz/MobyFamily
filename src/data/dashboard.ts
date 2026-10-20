import type {
  Account,
  BonusMember,
  ChildProfile,
  ChildQuickAction,
  DecisionRequest,
  FamilyMember,
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
  activeGoals: 1,
  dailyLimit: 15,
  dailySpent: 0,
  pocketMoney: 25,
  pocketMoneySchedule: 'в понедельник',
};

export const familyMembers: FamilyMember[] = [
  {
    id: 'member-child-sasha',
    kind: 'child',
    name: childProfile.name,
    roleLabel: 'Карта ребёнка',
    emoji: '👦🏻',
    age: childProfile.age,
    balance: childProfile.purchaseBalance,
  },
  {
    id: 'member-parent-alexey',
    kind: 'parent',
    name: 'Алексей',
    roleLabel: 'Совместный доступ',
    emoji: '👨🏻',
  },
];

export const bonusMembers: BonusMember[] = [
  {
    id: 'bonus-anna',
    kind: 'parent',
    name: 'Анна',
    roleLabel: 'Родитель',
    points: 1240,
  },
  {
    id: 'bonus-sasha',
    kind: 'child',
    name: 'Саша',
    emoji: '👦🏻',
    points: 350,
    goal: 500,
  },
];

export const accounts: Account[] = [
  {
    id: 'account-deposit',
    title: 'Накопительный счет «Доходный»',
    subtitle: 'МТбанк · 9.5% годовых',
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
  { id: 'payment-mobile', label: 'Связь', icon: 'phone-android', tone: 'secondary' },
  { id: 'payment-by-number', label: 'По номеру', icon: 'send-to-mobile', tone: 'tertiary' },
];

export const childQuickActions: ChildQuickAction[] = [
  { id: 'child-action-ask', label: 'Попросить деньги', icon: 'handshake', tone: 'primary' },
  { id: 'child-action-goal', label: 'Пополнить цель', icon: 'savings', tone: 'secondary' },
  { id: 'child-action-qr', label: 'Оплатить по QR', icon: 'qr-code-scanner', tone: 'accent' },
];

export const initialDecisions: DecisionRequest[] = [
  {
    id: 'decision-purchase',
    kind: 'purchase',
    title: 'Саша просит одобрить покупку · Книжный магазин',
    subtitle: 'Книги и комиксы · Магазин «Читай-город»',
    amount: 18,
    icon: 'menu-book',
    note: 'Превышен дневной лимит',
    noteAmount: 15,
    available: 42,
    hint: 'Сценарий КРОК. Запрос отправлен в 1 клик через QR',
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
  icon: 'smartphone',
  deadline: 'Цель до 1 сентября',
  saved: 180,
  target: 600,
  weeklyDelta: 15,
  monthsLeft: 4,
};

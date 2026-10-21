import type {
  BonusMember,
  ChildProfile,
  ChildQuickAction,
  DecisionRequest,
  FamilyMember,
  ParentCard,
  SavingsGoal,
  Task,
} from '@/types/dashboard';

export const parentCard: ParentCard = {
  title: 'Mastercard Platinum',
  last4: '7719',
  balance: 3420.5,
};

export const childProfile: ChildProfile = {
  name: 'Павел',
  initials: 'ПП',
  age: 12,
  ageGroup: '7–13 лет (под присмотром)',
  cardLast4: '4821',
  purchaseBalance: 42,
  dailyLimit: 15,
  dailySpent: 0,
  pocketMoney: 25,
  pocketMoneySchedule: 'в понедельник',
};

export const familyParentMember: FamilyMember = {
  id: 'member-parent-olga',
  kind: 'parent',
  name: 'Ольга',
  roleLabel: 'Совместный доступ',
  emoji: '👩🏻',
};

export const parentBonusMember: BonusMember = {
  id: 'bonus-parent',
  kind: 'parent',
  name: 'Ольга',
  roleLabel: 'Родитель',
  points: 1240,
};

export const childBonusMember: Omit<BonusMember, 'name'> = {
  id: 'bonus-child',
  kind: 'child',
  emoji: '👦🏻',
  points: 350,
  goal: 500,
};

export const childQuickActions: ChildQuickAction[] = [
  { id: 'child-action-ask', label: 'Попросить деньги', icon: 'handshake', tone: 'primary' },
  { id: 'child-action-qr', label: 'Оплатить по QR', icon: 'qr-code-scanner', tone: 'accent' },
  { id: 'child-action-history', label: 'История', icon: 'receipt-long', tone: 'primary' },
];

export function getInitialDecisions(childName: string): DecisionRequest[] {
  return [
    {
      id: 'decision-purchase',
      kind: 'purchase',
      title: `${childName} просит одобрить покупку · Книжный магазин`,
      subtitle: 'Книги и комиксы · Магазин «Читай-город»',
      amount: 18,
      icon: 'menu-book',
      note: 'Превышен дневной лимит',
      noteAmount: 15,
      available: 42,
      hint: 'Запрос на одобрение отправлен в 1 клик через QR',
    },
    {
      id: 'decision-task',
      kind: 'task',
      title: 'Помочь с покупками к ужину',
      subtitle: `${childName} отметил выполнено`,
      amount: 5,
      icon: 'shopping-cart',
      note: 'Ждёт подтверждения',
      noteDetail: 'Чек прикреплен',
    },
  ];
}

export const childTasks: Task[] = [
  {
    id: 'task-groceries',
    title: 'Помочь с покупками к ужину',
    subtitle: 'Хлеб, молоко и яблоки по списку',
    from: 'Задание от мамы',
    icon: 'shopping-cart',
    reward: { kind: 'money', amount: 5 },
    status: 'pending',
  },
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
  subtitle: 'Копилка мечты',
  icon: 'smartphone',
  deadline: 'Цель до 1 сентября',
  saved: 180,
  target: 600,
  weeklyDelta: 15,
  monthsLeft: 4,
};

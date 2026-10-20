import type {
  ActivityEvent,
  ChildProfile,
  ParentPoints,
  ParentProfile,
  PendingPurchase,
  SavingsGoal,
  Task,
} from '@/types/dashboard';

export const parentProfile: ParentProfile = {
  name: 'Анна',
  greeting: 'Здравствуйте, Анна',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAiO545l76QWuQmCHaZU-bGb03c5JLBEwo-BawjnoleKfqFTrV0NyzwWDQkfoSz1FtY6PMyS-bUZWhmeyk0_jTnCun2zCVzlsQm3u9cPOkDvra4R7Qk0R91x2_a-PbPx6RWufZ8dRtjyQs2nUEGtVyFK84emFNrJeixBioLz329BMuy7qPIY4oyVxa6q1MIeusuO1epSiIszSlBj4stSlW5tpggmyb3UWZabunxKLVv1cOPQpq7k_o_Kw',
};

export const childProfile: ChildProfile = {
  name: 'Саша',
  age: 12,
  ageGroup: '7–13 лет (под присмотром)',
  cardLast4: '4821',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBYDgi0-yYQTnxB79tiMuxVEWPp-3nTCUvnVhUTbjTI-pcCeF6LDWSrv38Tf7nKJeFKqqQVNp25WimHCGMwtBQEXJdDG9P3j83dwh9RiQxum867SGPfIm_ttMHVOr-PKnculwKKYaY8gXCmXe60_oCTlv2zkz1iCcv8JRnAFb1idtu4PRpsfCc8SJLaSxDyWr8AlPJ4Qnq7CQvrYbpvUUmFuGRD2YA6DkuskXMXVis64TL9OVrCRSJgxA',
  purchaseBalance: 42,
  savingsBalance: 180,
  activeGoals: 1,
  dailyLimit: 15,
  dailySpent: 0,
  pocketMoney: 25,
  pocketMoneySchedule: 'в пн',
};

export const savingsGoal: SavingsGoal = {
  id: 'goal-phone',
  title: 'Новый телефон',
  subtitle: 'Цель Саши до 1 сентября',
  saved: 180,
  target: 600,
  weeklyDelta: 15,
};

export const parentPoints: ParentPoints = {
  points: 80,
  levelLabel: 'Семейный уровень 2',
  description: 'Баллы — не деньги: бонусная программа совместного обучения',
};

export const initialTasks: Task[] = [
  {
    id: 'task-groceries',
    title: 'Помочь с покупками к ужину',
    subtitle: 'Саша отметил: выполнено',
    icon: 'shopping-bag',
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

export const pendingPurchase: PendingPurchase = {
  id: 'krok-books',
  title: 'Саша просит одобрить покупку',
  merchant: 'Книжный магазин',
  amount: 18,
  dailyLimit: 15,
  available: 42,
  scenario: 'Сценарий КРОК',
};

export const recentEvents: ActivityEvent[] = [
  {
    id: 'event-pocket-money',
    title: 'Получены карманные',
    subtitle: 'Сегодня, 08:30 • Автовыплата',
    icon: 'payments',
    tone: 'success',
    trailing: { kind: 'money', amount: 25 },
  },
  {
    id: 'event-canteen',
    title: 'Школьный буфет',
    subtitle: 'Вчера, 16:45 • Терминал 12-А',
    icon: 'restaurant',
    tone: 'neutral',
    trailing: { kind: 'money', amount: -3.5 },
  },
  {
    id: 'event-lesson',
    title: 'Урок: «Финбезопасность»',
    subtitle: 'Вчера • Тест сдан на 10/10',
    icon: 'school',
    tone: 'primary',
    trailing: { kind: 'points', amount: 10 },
  },
];

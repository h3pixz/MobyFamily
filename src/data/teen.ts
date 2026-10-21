import type { TeenQuickAction } from '@/types/dashboard';

export const teenQuickActions: TeenQuickAction[] = [
  {
    id: 'teen-transfer',
    label: 'Перевести',
    subtitle: 'Друзьям по номеру',
    icon: 'swap-horiz',
    tone: 'primary',
  },
  {
    id: 'teen-qr',
    label: 'Оплатить QR',
    subtitle: 'В кафе и на кассах',
    icon: 'qr-code-scanner',
    tone: 'blue',
  },
  {
    id: 'teen-tasks',
    label: 'Задания',
    subtitle: 'От родителей',
    icon: 'redeem',
    tone: 'warning',
  },
  {
    id: 'teen-analytics',
    label: 'Аналитика',
    subtitle: 'Траты за неделю',
    icon: 'trending-up',
    tone: 'tertiary',
  },
];

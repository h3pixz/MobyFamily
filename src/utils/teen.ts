const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

const MONTHS_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

export function getCurrentMonthName() {
  return MONTHS[new Date().getMonth()];
}

const categoryMeta: Record<string, { emoji: string; label: string; container: string }> = {
  FOOD: { emoji: '🍕', label: 'Кафе и фастфуд', container: 'bg-warning-soft' },
  TRANSFER: { emoji: '👨‍👦', label: 'Перевод', container: 'bg-success-soft' },
  SHOPPING: { emoji: '🛍️', label: 'Покупки', container: 'bg-primary-soft' },
  TRANSPORT: { emoji: '🚇', label: 'Транспорт', container: 'bg-primary-soft' },
  EDUCATION: { emoji: '📚', label: 'Образование', container: 'bg-primary-soft' },
  ENTERTAINMENT: { emoji: '🎮', label: 'Развлечения', container: 'bg-surface-container' },
  SAVINGS: { emoji: '🎯', label: 'Копилка', container: 'bg-success-soft' },
  TASK_REWARD: { emoji: '🎁', label: 'Награда за задание', container: 'bg-warning-soft' },
  RESTRICTED_18: { emoji: '🚫', label: 'Запрещённая покупка', container: 'bg-surface-container' },
};

export function getCategoryMeta(category: string) {
  return (
    categoryMeta[category] ?? {
      emoji: '💳',
      label: 'Операция',
      container: 'bg-surface-container',
    }
  );
}

export function isIncomingTransaction(category: string) {
  return category === 'TRANSFER' || category === 'TASK_REWARD';
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function formatTransactionDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((today - day) / (24 * 60 * 60 * 1000));
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (diffDays === 0) {
    return `Сегодня, ${time}`;
  }
  if (diffDays === 1) {
    return `Вчера, ${time}`;
  }

  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${time}`;
}

export function getMonthsUntilAge(birthDay: string, age: number) {
  const birth = new Date(birthDay);
  const target = new Date(birth);
  target.setFullYear(birth.getFullYear() + age);

  const now = new Date();
  let months =
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());

  if (target.getDate() < now.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function getMonthsUntilDate(value?: string | null) {
  if (!value) {
    return 0;
  }

  const diff = new Date(value).getTime() - Date.now();

  return Math.max(0, Math.ceil(diff / (30.44 * 24 * 60 * 60 * 1000)));
}

export function getQuestLevel(completedCheckpoints: number) {
  return Math.max(1, completedCheckpoints);
}

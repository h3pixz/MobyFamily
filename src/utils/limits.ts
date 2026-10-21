export const POCKET_MONEY_DAYS = [
  { value: 1, short: 'Пн', schedule: 'понедельникам' },
  { value: 2, short: 'Вт', schedule: 'вторникам' },
  { value: 3, short: 'Ср', schedule: 'средам' },
  { value: 4, short: 'Чт', schedule: 'четвергам' },
  { value: 5, short: 'Пт', schedule: 'пятницам' },
  { value: 6, short: 'Сб', schedule: 'субботам' },
  { value: 7, short: 'Вс', schedule: 'воскресеньям' },
] as const;

export function getPocketMoneySchedule(day: number) {
  return POCKET_MONEY_DAYS.find((item) => item.value === day)?.schedule ?? 'понедельникам';
}

export function clampDailyLimit(value: number, min = 0, max = 100, step = 5) {
  const snapped = Math.round(value / step) * step;

  return Math.min(max, Math.max(min, snapped));
}

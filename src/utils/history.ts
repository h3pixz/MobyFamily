import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import type { DayGroup, TopUpEntry } from '@/types/history';
import { getGenitiveName } from '@/utils/family';
import { getFirstName } from '@/utils/greeting';

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const MONTHS_PREPOSITIONAL = [
  'январе',
  'феврале',
  'марте',
  'апреле',
  'мае',
  'июне',
  'июле',
  'августе',
  'сентябре',
  'октябре',
  'ноябре',
  'декабре',
];

const WEEKDAYS = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getComment(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function getMonthLabelPrepositional(date: Date) {
  return MONTHS_PREPOSITIONAL[date.getMonth()];
}

export function formatDayLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const diffDays = Math.round((startOfDay(today) - startOfDay(date)) / (24 * 60 * 60 * 1000));
  const dayAndMonth = `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]}`;

  if (diffDays === 0) {
    return `Сегодня, ${dayAndMonth}`;
  }
  if (diffDays === 1) {
    return `Вчера, ${dayAndMonth}`;
  }

  return `${dayAndMonth}, ${WEEKDAYS[date.getDay()]}`;
}

export function getTopUpSourceLabel(entry: Pick<TopUpEntry, 'fromName' | 'isChildSelf'>) {
  if (entry.isChildSelf) {
    return 'Самостоятельное пополнение';
  }
  if (entry.fromName) {
    return `От ${getGenitiveName(entry.fromName)}`;
  }

  return 'От родителя';
}

export function toTopUpEntries(
  piggyBanks: PiggyBankResponseDto[],
  childId: string,
): TopUpEntry[] {
  return piggyBanks
    .filter((piggyBank) => piggyBank.owner.id === childId)
    .flatMap((piggyBank) =>
      piggyBank.contributions.map((contribution) => ({
        id: contribution.id,
        amount: contribution.amount,
        goalTitle: piggyBank.title,
        comment: getComment(contribution.comment),
        createdAt: contribution.createdAt,
        fromName: getFirstName(contribution.user.name),
        isChildSelf: contribution.user.id === childId,
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function groupByDay<T extends { createdAt: string }>(entries: T[]): DayGroup<T>[] {
  const groups = new Map<string, T[]>();

  entries.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const group = groups.get(key);

    if (group) {
      group.push(entry);
      return;
    }

    groups.set(key, [entry]);
  });

  return Array.from(groups.entries()).map(([key, groupEntries]) => ({
    key,
    label: formatDayLabel(groupEntries[0].createdAt),
    entries: groupEntries,
  }));
}

export function getCurrentMonthTopUps(entries: TopUpEntry[]) {
  const now = new Date();

  return entries.reduce(
    (result, entry) => {
      const date = new Date(entry.createdAt);

      if (date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) {
        return result;
      }

      return { total: result.total + entry.amount, count: result.count + 1 };
    },
    { total: 0, count: 0 },
  );
}

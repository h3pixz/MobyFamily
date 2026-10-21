import type { TaskResponseDto } from '@/api/gen/models/TaskResponseDto';
import type { IconName } from '@/types/icons';
import type { TaskFilter, TaskItem, TaskStatusKind } from '@/types/tasks';
import { getGenitiveName, getInitials } from '@/utils/family';
import { pluralize } from '@/utils/format';
import { getFirstName } from '@/utils/greeting';

const TASK_ICON_RULES: [RegExp, IconName][] = [
  [/убор|пылесос|чист|мыть|порядок/i, 'cleaning-services'],
  [/чита|книг|литератур|глав|урок/i, 'menu-book'],
  [/продукт|покуп|магазин|список/i, 'shopping-cart'],
  [/посуд|готов|ужин|обед|еда|кухн/i, 'restaurant'],
  [/собак|кош|питом|гуля/i, 'pets'],
  [/школ|домашн|учёб|учеб|задач/i, 'school'],
];

const WEEKDAYS_GENITIVE = [
  'воскресенья',
  'понедельника',
  'вторника',
  'среды',
  'четверга',
  'пятницы',
  'субботы',
];

const STATUS_KIND: Record<string, TaskStatusKind> = {
  SUBMITTED: 'review',
  COMPLETED: 'done',
};

function getTaskIcon(title: string): IconName {
  const rule = TASK_ICON_RULES.find(([pattern]) => pattern.test(title));

  return rule?.[1] ?? 'assignment';
}

function asString(value: object | null | undefined) {
  return typeof value === 'string' ? value : null;
}

export function toTaskItem(task: TaskResponseDto): TaskItem {
  const creatorName = task.creator?.name ?? '';
  const firstName = creatorName ? getFirstName(creatorName) : '';

  return {
    id: task.id,
    title: task.title,
    description: asString(task.description) ?? '',
    reward: task.rewardAmount,
    deadline: asString(task.deadline),
    authorName: firstName ? `От ${getGenitiveName(firstName)}` : 'От родителей',
    authorInitials: creatorName ? getInitials(creatorName) : '',
    status: STATUS_KIND[task.status] ?? 'active',
    submittedAt: asString(task.submittedAt),
    photoUrl: asString(task.photoUrl),
    icon: getTaskIcon(task.title),
    updatedAt: task.updatedAt,
  };
}

export function filterTasksByStatus(tasks: TaskItem[], filter: TaskFilter) {
  return tasks.filter((task) => task.status === filter);
}

export function getTaskDeadlineLabel(deadline: string | null) {
  if (!deadline) {
    return 'Без ограничения времени';
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return 'Без ограничения времени';
  }

  return `Срок: до ${WEEKDAYS_GENITIVE[date.getDay()]}`;
}

export function getRelativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();

  if (Number.isNaN(diff) || diff < 60_000) {
    return 'только что';
  }

  const minutes = Math.floor(diff / 60_000);

  if (minutes < 60) {
    return `${minutes} мин назад`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${pluralize(hours, ['час', 'часа', 'часов'])} назад`;
  }

  const days = Math.floor(hours / 24);

  return `${days} ${pluralize(days, ['день', 'дня', 'дней'])} назад`;
}

export function getMonthlyEarnings(tasks: TaskItem[]) {
  const now = new Date();

  return tasks
    .filter((task) => task.status === 'done')
    .filter((task) => {
      const date = new Date(task.updatedAt);

      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, task) => sum + task.reward, 0);
}

export function getTaskProgress(tasks: TaskItem[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'done').length;

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

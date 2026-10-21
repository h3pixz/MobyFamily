import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import type { BadgeTone } from '@/components/ui/badge';
import type { HistoryFilter } from '@/types/history';
import type { IconName } from '@/types/icons';
import { getCategoryMeta, isIncomingTransaction } from '@/utils/teen';

const CATEGORY_COLORS = ['#FB7800', '#1D63ED', '#10B981'];

export const HISTORY_FILTERS: { key: HistoryFilter; label: string; emoji?: string }[] = [
  { key: 'all', label: 'Все операции' },
  { key: 'purchases', label: 'Покупки', emoji: '🛒' },
  { key: 'requests', label: 'Запросы / КРОК', emoji: '⚡' },
  { key: 'income', label: 'Пополнения', emoji: '💸' },
  { key: 'savings', label: 'Копилка', emoji: '🎯' },
];

export type MonthlySpending = {
  total: number;
  count: number;
  categories: {
    category: string;
    label: string;
    amount: number;
    share: number;
    color: string;
  }[];
};

export type TransactionBadge = {
  label: string;
  tone: BadgeTone;
  icon: IconName;
};

export function filterTransactions(
  transactions: DetailedTransactionDto[],
  filter: HistoryFilter,
) {
  switch (filter) {
    case 'purchases':
      return transactions.filter(
        (transaction) =>
          !isIncomingTransaction(transaction.category) && transaction.category !== 'SAVINGS',
      );
    case 'requests':
      return transactions.filter(
        (transaction) => transaction.status === 'PENDING_PARENT_APPROVAL',
      );
    case 'income':
      return transactions.filter((transaction) => isIncomingTransaction(transaction.category));
    case 'savings':
      return transactions.filter((transaction) => transaction.category === 'SAVINGS');
    default:
      return transactions;
  }
}

export function getMonthlySpending(transactions: DetailedTransactionDto[]): MonthlySpending {
  const now = new Date();
  const monthly = transactions.filter((transaction) => {
    const date = new Date(transaction.createdAt);

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      transaction.status === 'SUCCESS' &&
      !isIncomingTransaction(transaction.category) &&
      transaction.category !== 'SAVINGS'
    );
  });

  const byCategory = new Map<string, number>();

  monthly.forEach((transaction) => {
    byCategory.set(
      transaction.category,
      (byCategory.get(transaction.category) ?? 0) + transaction.amount,
    );
  });

  const total = monthly.reduce((sum, transaction) => sum + transaction.amount, 0);
  const categories = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, CATEGORY_COLORS.length)
    .map(([category, amount], index) => ({
      category,
      label: getCategoryMeta(category).label,
      amount,
      share: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: CATEGORY_COLORS[index],
    }));

  return { total, count: monthly.length, categories };
}

export function getTransactionBadge(transaction: DetailedTransactionDto): TransactionBadge {
  if (transaction.status === 'PENDING_PARENT_APPROVAL') {
    return { label: 'Ждёт одобрения', tone: 'warning', icon: 'schedule' };
  }
  if (transaction.status === 'DECLINED_BY_BANK') {
    return { label: 'Отклонено банком', tone: 'neutral', icon: 'block' };
  }
  if (transaction.status === 'DECLINED_BY_LIMIT') {
    return { label: 'Отклонено по лимиту', tone: 'neutral', icon: 'speed' };
  }
  if (transaction.category === 'SAVINGS') {
    return { label: 'Пополнение копилки', tone: 'info', icon: 'savings' };
  }
  if (transaction.category === 'TASK_REWARD') {
    return { label: 'Награда за задание', tone: 'success', icon: 'redeem' };
  }
  if (isIncomingTransaction(transaction.category)) {
    return { label: 'Зачисление на карту', tone: 'success', icon: 'check-circle' };
  }

  return { label: 'Оплата картой', tone: 'neutral', icon: 'credit-card' };
}

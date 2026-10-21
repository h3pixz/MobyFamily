import { Text, View } from 'react-native';

import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import { TransactionCard } from '@/components/history/transaction-card';
import { TransactionHistoryEmpty } from '@/components/history/transaction-history-empty';
import type { DayGroup } from '@/types/history';
import { pluralize } from '@/utils/format';

type TransactionHistoryProps = {
  groups: DayGroup<DetailedTransactionDto>[];
  emptyTitle?: string;
  emptySubtitle?: string;
};

export function TransactionHistory({
  groups,
  emptyTitle,
  emptySubtitle,
}: TransactionHistoryProps) {
  if (groups.length === 0) {
    return <TransactionHistoryEmpty title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <View className="gap-4">
      {groups.map((group) => {
        const count = group.entries.length;
        const countLabel = pluralize(count, ['операция', 'операции', 'операций']);

        return (
          <View key={group.key} className="gap-2">
            <View className="flex-row items-center justify-between gap-2 px-1">
              <Text className="flex-1 text-label-md font-inter-semibold uppercase tracking-wider text-on-surface-variant">
                {group.label}
              </Text>
              <Text className="text-label-sm font-inter text-outline">
                {count} {countLabel}
              </Text>
            </View>

            <View className="gap-2">
              {group.entries.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

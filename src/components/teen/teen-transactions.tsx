import { Pressable, Text, View } from 'react-native';

import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { formatBYN } from '@/utils/format';
import { formatTransactionDate, getCategoryMeta, isIncomingTransaction } from '@/utils/teen';

type TeenTransactionsProps = {
  transactions: DetailedTransactionDto[];
  onPressAll: () => void;
};

function statusLabel(transaction: DetailedTransactionDto, incoming: boolean) {
  if (transaction.status === 'DECLINED_BY_LIMIT') {
    return 'Отклонено по лимиту';
  }
  if (transaction.status === 'DECLINED_BY_BANK') {
    return 'Отклонено банком';
  }

  return incoming ? 'Без комиссии' : 'Оплата картой';
}

export function TeenTransactions({ transactions, onPressAll }: TeenTransactionsProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-body-md font-inter-bold text-on-surface">История операций</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Все операции"
          onPress={onPressAll}
          hitSlop={8}
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
          <Text className="text-label-md font-inter-semibold text-primary-container">Все →</Text>
        </Pressable>
      </View>

      <Card className="px-2 py-1">
        {transactions.length === 0 ? (
          <Text className="px-2 py-4 text-center text-body-sm font-inter text-outline">
            Операций пока нет
          </Text>
        ) : (
          transactions.map((transaction, index) => {
            const meta = getCategoryMeta(transaction.category);
            const incoming = isIncomingTransaction(transaction.category);
            const last = index === transactions.length - 1;

            return (
              <View
                key={transaction.id}
                className={`flex-row items-center justify-between gap-2 p-2.5 ${
                  last ? '' : 'border-b border-outline-variant/15'
                }`}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View
                    className={`h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.container}`}>
                    <Text className="text-lg">{meta.emoji}</Text>
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-label-md font-inter-bold leading-tight text-on-surface">
                      {transaction.merchant}
                    </Text>
                    <Text numberOfLines={1} className="mt-0.5 text-[10px] font-inter-medium text-outline">
                      {formatTransactionDate(transaction.createdAt)} • {meta.label}
                    </Text>
                  </View>
                </View>

                <View className="flex-shrink-0 items-end">
                  <View className="flex-row items-center gap-0.5">
                    <Text
                      className={`text-label-md font-inter-bold ${
                        incoming ? 'text-tertiary' : 'text-on-surface'
                      }`}>
                      {incoming ? '+' : '−'}
                      {formatBYN(transaction.amount)}
                    </Text>
                    <BynIcon size={8} color={incoming ? '#006242' : '#191C1E'} />
                  </View>
                  <Text
                    className={`mt-0.5 text-[9px] font-inter-medium ${
                      transaction.status === 'SUCCESS' ? 'text-outline' : 'text-secondary'
                    }`}>
                    {statusLabel(transaction, incoming)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </Card>
    </View>
  );
}

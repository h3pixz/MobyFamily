import { Text, View } from 'react-native';

import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { formatBYN, formatTime } from '@/utils/format';
import { getCategoryMeta, isIncomingTransaction } from '@/utils/teen';
import { getTransactionBadge } from '@/utils/transactions';

type TransactionCardProps = {
  transaction: DetailedTransactionDto;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const meta = getCategoryMeta(transaction.category);
  const incoming = isIncomingTransaction(transaction.category);
  const badge = getTransactionBadge(transaction);

  return (
    <Card className="p-3.5">
      <View className="flex-row items-start gap-3">
        <View
          className={`h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${meta.container}`}>
          <Text className="text-xl">{meta.emoji}</Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              numberOfLines={1}
              className="min-w-0 flex-1 text-headline-sm font-inter-semibold leading-tight text-on-surface">
              {transaction.merchant}
            </Text>
            <View className="flex-shrink-0 flex-row items-center gap-0.5">
              <Text
                className={`text-headline-sm font-inter-bold ${
                  incoming ? 'text-tertiary' : 'text-on-surface'
                }`}>
                {incoming ? '+' : '−'}
                {formatBYN(transaction.amount)}
              </Text>
              <BynIcon size={9} color={incoming ? '#006242' : '#191C1E'} />
            </View>
          </View>

          <View className="mt-0.5 flex-row flex-wrap items-center gap-1">
            <Text className="text-body-sm font-inter text-on-surface-variant">{meta.label}</Text>
            <Text className="text-body-sm text-outline-variant">•</Text>
            <Text className="text-body-sm font-inter text-on-surface-variant">
              {formatTime(transaction.createdAt)}
            </Text>
          </View>

          <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
            <Badge label={badge.label} tone={badge.tone} icon={badge.icon} />
          </View>
        </View>
      </View>
    </Card>
  );
}

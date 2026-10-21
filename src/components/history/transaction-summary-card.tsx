import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { formatBYN, pluralize } from '@/utils/format';
import type { MonthlySpending } from '@/utils/transactions';

type TransactionSummaryCardProps = {
  monthLabel: string;
  spending: MonthlySpending;
};

export function TransactionSummaryCard({ monthLabel, spending }: TransactionSummaryCardProps) {
  const countLabel = pluralize(spending.count, ['операция', 'операции', 'операций']);

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
          <Icon name="analytics" size={18} color="#1D63ED" />
          <Text className="text-label-md font-inter-semibold uppercase tracking-wider text-on-surface-variant">
            Потрачено в {monthLabel}
          </Text>
        </View>
        <Badge label={`${spending.count} ${countLabel}`} tone="info" />
      </View>

      <View className="flex-row items-center gap-1.5">
        <Text className="text-display-mobile font-inter-bold tracking-tight text-on-surface">
          {formatBYN(spending.total)}
        </Text>
        <BynIcon size={13} color="#191C1E" style={{ marginTop: 4 }} />
      </View>

      {spending.categories.length > 0 ? (
        <View className="gap-2 pt-1">
          <View className="h-2.5 w-full flex-row overflow-hidden rounded-full bg-surface-container">
            {spending.categories.map((category) => (
              <View
                key={category.category}
                className="h-full"
                style={{ width: `${category.share}%`, backgroundColor: category.color }}
              />
            ))}
          </View>

          <View className="flex-row gap-2">
            {spending.categories.map((category) => (
              <View
                key={category.category}
                className="min-w-0 flex-1 gap-0.5 rounded-xl bg-surface-low p-2">
                <View className="flex-row items-center gap-1">
                  <View
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <Text
                    numberOfLines={1}
                    className="text-label-sm font-inter-medium text-on-surface-variant">
                    {category.label}
                  </Text>
                </View>
                <View className="flex-row items-center gap-0.5">
                  <Text className="text-label-md font-inter-semibold text-on-surface">
                    {formatBYN(category.amount)}
                  </Text>
                  <BynIcon size={8} color="#191C1E" />
                </View>
                <Text className="text-label-sm font-inter text-outline">
                  {category.share}% расходов
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

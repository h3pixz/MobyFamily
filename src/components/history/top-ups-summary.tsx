import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { formatBYN, pluralize } from '@/utils/format';

type TopUpsSummaryProps = {
  monthLabel: string;
  total: number;
  count: number;
};

export function TopUpsSummary({ monthLabel, total, count }: TopUpsSummaryProps) {
  const countLabel = pluralize(count, ['пополнение', 'пополнения', 'пополнений']);

  return (
    <Card className="gap-2 p-4">
      <View className="flex-row items-center gap-1.5">
        <Icon name="savings" size={18} color="#1D63ED" />
        <Text className="flex-1 text-label-md font-inter-semibold uppercase tracking-wider text-on-surface-variant">
          Пополнено в {monthLabel}
        </Text>
      </View>

      <View className="flex-row flex-wrap items-end justify-between gap-2">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-display-mobile font-inter-bold tracking-tight text-on-surface">
            {formatBYN(total)}
          </Text>
          <BynIcon size={12} color="#191C1E" style={{ marginTop: 4 }} />
        </View>
        <Badge label={`${count} ${countLabel}`} tone="success" />
      </View>

      <Text className="text-body-sm font-inter text-on-surface-variant">
        Только пополнения копилки за месяц
      </Text>
    </Card>
  );
}

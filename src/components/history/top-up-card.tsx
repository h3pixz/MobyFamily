import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { TopUpEntry } from '@/types/history';
import { formatBYN } from '@/utils/format';
import { formatTopUpTime, getTopUpSourceLabel } from '@/utils/history';

type TopUpCardProps = {
  entry: TopUpEntry;
};

export function TopUpCard({ entry }: TopUpCardProps) {
  return (
    <Card className="p-3.5">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft">
          <Icon name="savings" size={22} color="#1D63ED" />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              numberOfLines={1}
              className="min-w-0 flex-1 text-headline-sm font-inter-semibold leading-tight text-on-surface">
              Пополнение копилки
            </Text>
            <View className="flex-shrink-0 flex-row items-center gap-0.5">
              <Text className="text-headline-sm font-inter-bold text-tertiary">
                +{formatBYN(entry.amount)}
              </Text>
              <BynIcon size={9} color="#006242" />
            </View>
          </View>

          <View className="mt-0.5 flex-row flex-wrap items-center gap-1">
            <Text
              numberOfLines={1}
              className="shrink text-body-sm font-inter text-on-surface-variant">
              Цель: {entry.goalTitle}
            </Text>
            <Text className="text-body-sm text-outline-variant">•</Text>
            <Text className="text-body-sm font-inter text-on-surface-variant">
              {formatTopUpTime(entry.createdAt)}
            </Text>
          </View>

          {entry.comment ? (
            <Text className="mt-1 text-body-sm font-inter text-on-surface">{entry.comment}</Text>
          ) : null}

          <View className="mt-2 flex-row flex-wrap items-center gap-1.5">
            <Badge
              label={getTopUpSourceLabel(entry)}
              tone={entry.isChildSelf ? 'info' : 'neutral'}
              icon={entry.isChildSelf ? 'check-circle' : 'favorite'}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

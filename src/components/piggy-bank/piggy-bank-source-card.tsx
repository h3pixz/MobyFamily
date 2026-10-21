import { Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

type PiggyBankSourceCardProps = {
  title: string;
  cardNumberMask?: string;
  balance: number;
};

export function PiggyBankSourceCard({
  title,
  cardNumberMask,
  balance,
}: PiggyBankSourceCardProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between gap-3 rounded-xl bg-surface-low p-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <View className="h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-fixed">
          <Icon name="credit-card" size={20} color="#004BC3" />
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-label-lg font-inter-semibold text-on-surface">
            {title}
          </Text>
          {cardNumberMask ? (
            <Text numberOfLines={1} className="mt-0.5 text-label-sm font-inter text-outline">
              {cardNumberMask}
            </Text>
          ) : null}
          <View className="mt-0.5 flex-row items-center">
            <Text className="text-body-sm font-inter text-on-surface-variant">
              Доступно: {formatBYN(balance)}
            </Text>
            <BynIcon size={8} color="#424655" style={{ marginLeft: 3 }} />
          </View>
        </View>
      </View>
    </View>
  );
}

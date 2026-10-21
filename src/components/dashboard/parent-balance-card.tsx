import { Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ParentCard } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type ParentBalanceCardProps = {
  card: ParentCard;
};

export function ParentBalanceCard({ card }: ParentBalanceCardProps) {
  return (
    <BankCard colors={['#1D63ED', '#2B73FA']} padding={20}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-2 border-b border-white/10 pb-3">
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-label-sm font-inter-medium text-white/80">
            {card.title}
          </Text>
          <View className="flex-shrink-0 flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/15 px-2.5 py-1">
            <View className="h-2 w-2 rounded-full bg-success" />
            <Text className="text-label-md font-inter-medium tracking-wider text-white">
              •••• {card.last4}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-label-sm font-inter-medium uppercase tracking-wider text-white/80">
            Баланс карты
          </Text>
          <View className="mt-1 flex-row items-center gap-1.5">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
              className="min-w-0 flex-shrink text-[30px] font-inter-extrabold tracking-tight text-white">
              {formatBYN(card.balance)}
            </Text>
            <BynIcon size={16} color="#FFFFFF" style={{ marginTop: 4 }} />
          </View>
        </View>
      </View>
    </BankCard>
  );
}

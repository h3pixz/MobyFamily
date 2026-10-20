import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ParentCard } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type ParentBalanceCardProps = {
  card: ParentCard;
  onPressAction: (label: string) => void;
};

export function ParentBalanceCard({ card, onPressAction }: ParentBalanceCardProps) {
  return (
    <BankCard colors={['#1D63ED', '#2B73FA']} padding={20}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between border-b border-white/10 pb-3">
          <Text className="text-label-sm font-inter-medium text-white/80">{card.title}</Text>
          <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/15 px-2.5 py-1">
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
            <Text className="text-[30px] font-inter-extrabold leading-9 tracking-tight text-white">
              {formatBYN(card.balance)}
            </Text>
            <BynIcon size={16} color="#FFFFFF" style={{ marginTop: 4 }} />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => onPressAction('История')}
          className="flex-row items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/15 py-2.5"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
          <Icon name="receipt-long" size={16} color="#FFFFFF" />
          <Text className="text-label-md font-inter-semibold text-white">История</Text>
        </Pressable>
      </View>
    </BankCard>
  );
}

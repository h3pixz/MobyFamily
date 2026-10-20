import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ParentCard } from '@/types/dashboard';
import type { IconName } from '@/types/icons';
import { formatBYN } from '@/utils/format';

const actions: { id: string; label: string; icon: IconName; filled?: boolean }[] = [
  { id: 'top-up', label: 'Пополнить', icon: 'add', filled: true },
  { id: 'history', label: 'История', icon: 'receipt-long' },
];

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

        <View className="flex-row gap-2.5">
          {actions.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              onPress={() => onPressAction(action.label)}
              className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                action.filled
                  ? 'bg-surface-lowest'
                  : 'border border-white/20 bg-white/15'
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <Icon
                name={action.icon}
                size={16}
                color={action.filled ? '#004BC3' : '#FFFFFF'}
              />
              <Text
                className={`text-label-md ${
                  action.filled
                    ? 'font-inter-semibold text-primary'
                    : 'font-inter-semibold text-white'
                }`}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </BankCard>
  );
}

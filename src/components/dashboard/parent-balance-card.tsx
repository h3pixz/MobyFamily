import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { BankCard } from '@/components/dashboard/bank-card';
import type { ParentCard } from '@/types/dashboard';
import type { IconName } from '@/types/icons';
import { formatBYN } from '@/utils/format';

const actions: { id: string; label: string; icon: IconName; filled?: boolean }[] = [
  { id: 'top-up', label: 'Пополнить', icon: 'add-card', filled: true },
  { id: 'transfer', label: 'Перевести', icon: 'send' },
  { id: 'history', label: 'История', icon: 'receipt-long' },
];

type ParentBalanceCardProps = {
  card: ParentCard;
  onPressAction: (label: string) => void;
};

export function ParentBalanceCard({ card, onPressAction }: ParentBalanceCardProps) {
  return (
    <BankCard colors={['#004BC3', '#1D63ED']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-label-sm font-inter-medium text-white/80">{card.title}</Text>
          <View className="flex-row items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1">
            <Icon name="contactless" size={16} color="#FFFFFF" />
            <Text className="text-label-md font-inter-semibold tracking-wider text-white">
              •• {card.last4}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-label-md font-inter-semibold uppercase tracking-wider text-white/80">
            Баланс карты
          </Text>
          <View className="mt-1 flex-row items-center gap-1.5">
            <Text className="text-display-mobile font-inter-bold tracking-tight text-white">
              {formatBYN(card.balance)}
            </Text>
            <BynIcon size={16} color="#FFFFFF" style={{ marginTop: 4 }} />
          </View>
        </View>

        <View className="flex-row gap-2">
          {actions.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              onPress={() => onPressAction(action.label)}
              className={`flex-1 items-center justify-center gap-1 rounded-lg py-2 ${
                action.filled ? 'bg-surface-lowest' : 'bg-white/15'
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <Icon
                name={action.icon}
                size={20}
                color={action.filled ? '#004BC3' : '#FFFFFF'}
              />
              <Text
                className={`text-label-sm ${
                  action.filled
                    ? 'font-inter-semibold text-primary'
                    : 'font-inter-medium text-white'
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

import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { Account } from '@/types/dashboard';
import { formatBYN, pluralize } from '@/utils/format';

type AccountsCardProps = {
  accounts: Account[];
  onPress: (title: string) => void;
};

export function AccountsCard({ accounts, onPress }: AccountsCardProps) {
  const countLabel = `${accounts.length} ${pluralize(accounts.length, [
    'счёт',
    'счёта',
    'счетов',
  ])}`;

  return (
    <Card className="gap-space-sm p-space-md">
      <View className="flex-row items-center justify-between">
        <Text className="text-headline-sm font-inter-semibold text-on-surface">
          Мои счета и вклады
        </Text>
        <Text className="text-label-sm font-inter-medium text-outline">{countLabel}</Text>
      </View>

      {accounts.map((account) => {
        const tertiary = account.tone === 'tertiary';

        return (
          <Pressable
            key={account.id}
            accessibilityRole="button"
            onPress={() => onPress(account.title)}
            className="flex-row items-center justify-between gap-2 rounded-xl border border-outline-variant/30 bg-surface-low p-3"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
            <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
              <View
                className={`h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                  tertiary ? 'bg-tertiary-fixed/50' : 'bg-primary-fixed'
                }`}>
                <Icon name={account.icon} size={22} color={tertiary ? '#006242' : '#004BC3'} />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  className="text-label-lg font-inter-semibold text-on-surface"
                  numberOfLines={2}>
                  {account.title}
                </Text>
                <Text className="text-body-sm text-outline" numberOfLines={1}>
                  {account.subtitle}
                </Text>
              </View>
            </View>

            <View className="flex-shrink-0 items-end pl-2">
              <View className="flex-row items-center gap-1">
                <Text className="text-label-lg font-inter-bold text-on-surface">
                  {formatBYN(account.amount)}
                </Text>
                <BynIcon size={10} color="#191C1E" />
              </View>
              {account.delta !== undefined ? (
                <View className="flex-row items-center">
                  <Text className="text-label-sm font-inter-medium text-tertiary">
                    +{formatBYN(account.delta)}
                  </Text>
                  <BynIcon size={9} color="#006242" style={{ marginHorizontal: 2 }} />
                  <Text className="text-label-sm font-inter-medium text-tertiary">/мес</Text>
                </View>
              ) : (
                <Text className="text-label-sm font-inter-medium text-outline">{account.note}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </Card>
  );
}

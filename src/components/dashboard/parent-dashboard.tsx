import { Text, View } from 'react-native';

import { AccountsCard } from '@/components/dashboard/accounts-card';
import { FamilyAlert } from '@/components/dashboard/family-alert';
import { ParentBalanceCard } from '@/components/dashboard/parent-balance-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import type { Account, ParentCard, ParentProfile, QuickActionItem } from '@/types/dashboard';

type ParentDashboardProps = {
  profile: ParentProfile;
  card: ParentCard;
  accounts: Account[];
  quickPayments: QuickActionItem[];
  pendingCount: number;
  onPressAction: (label: string) => void;
  onSwitchToChild: () => void;
};

export function ParentDashboard({
  profile,
  card,
  accounts,
  quickPayments,
  pendingCount,
  onPressAction,
  onSwitchToChild,
}: ParentDashboardProps) {
  return (
    <View className="gap-space-md">
      <View className="px-0.5 pt-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-headline-sm font-inter-semibold text-on-surface">
            {profile.greeting}
          </Text>
          <Text className="text-[16px]">✨</Text>
        </View>
        <Text className="text-label-sm font-inter-medium text-outline">{profile.roleLabel}</Text>
      </View>

      <ParentBalanceCard card={card} onPressAction={onPressAction} />
      <FamilyAlert count={pendingCount} onPress={onSwitchToChild} />
      <AccountsCard accounts={accounts} onPress={onPressAction} />
      <QuickActions title="Быстрый платеж" actions={quickPayments} onPress={onPressAction} />
    </View>
  );
}

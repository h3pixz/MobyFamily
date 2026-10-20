import { View } from 'react-native';

import { AccountsCard } from '@/components/dashboard/accounts-card';
import { FamilyAlert } from '@/components/dashboard/family-alert';
import { FamilyMembersSection } from '@/components/dashboard/family-members';
import { ParentBalanceCard } from '@/components/dashboard/parent-balance-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import type { Account, FamilyMember, ParentCard, QuickActionItem } from '@/types/dashboard';

type ParentDashboardProps = {
  card: ParentCard;
  members: FamilyMember[];
  accounts: Account[];
  quickPayments: QuickActionItem[];
  pendingCount: number;
  onPressAction: (label: string) => void;
  onSwitchToChild: () => void;
};

export function ParentDashboard({
  card,
  members,
  accounts,
  quickPayments,
  pendingCount,
  onPressAction,
  onSwitchToChild,
}: ParentDashboardProps) {
  return (
    <View className="gap-space-md">
      <ParentBalanceCard card={card} onPressAction={onPressAction} />

      <FamilyMembersSection
        members={members}
        onPressChild={onSwitchToChild}
        onPressMember={(member) => onPressAction(`Профиль ${member.name}`)}
        onPressManage={() => onPressAction('Управление семьёй')}
        onPressAdd={() => onPressAction('Добавить члена семьи')}
      />

      <FamilyAlert count={pendingCount} onPress={onSwitchToChild} />
      <AccountsCard accounts={accounts} onPress={onPressAction} />
      <QuickActions title="Быстрый платеж" actions={quickPayments} onPress={onPressAction} />
    </View>
  );
}

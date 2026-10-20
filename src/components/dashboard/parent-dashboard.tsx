import { View } from 'react-native';

import { AccountsCard } from '@/components/dashboard/accounts-card';
import { BonusesCard } from '@/components/dashboard/bonuses-card';
import { FamilyAlert } from '@/components/dashboard/family-alert';
import { FamilyMembersSection } from '@/components/dashboard/family-members';
import { ParentBalanceCard } from '@/components/dashboard/parent-balance-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import type {
  Account,
  BonusMember,
  FamilyMember,
  ParentCard,
  QuickActionItem,
} from '@/types/dashboard';

type ParentDashboardProps = {
  card: ParentCard;
  members: FamilyMember[];
  bonuses: BonusMember[];
  accounts: Account[];
  quickPayments: QuickActionItem[];
  pendingCount: number;
  onPressAction: (label: string) => void;
  onPressManageFamily: () => void;
};

export function ParentDashboard({
  card,
  members,
  bonuses,
  accounts,
  quickPayments,
  pendingCount,
  onPressAction,
  onPressManageFamily,
}: ParentDashboardProps) {
  return (
    <View className="gap-space-md">
      <ParentBalanceCard card={card} />

      <FamilyMembersSection
        members={members}
        onPressMember={(member) => onPressAction(`Профиль ${member.name}`)}
        onPressManage={onPressManageFamily}
        onPressAdd={() => onPressAction('Добавить члена семьи')}
      />

      <FamilyAlert
        count={pendingCount}
        onPress={() => onPressAction('Семейные уведомления')}
      />
      <BonusesCard members={bonuses} onPress={onPressAction} />
      <AccountsCard accounts={accounts} onPress={onPressAction} />
      <QuickActions title="Быстрый платеж" actions={quickPayments} onPress={onPressAction} />
    </View>
  );
}

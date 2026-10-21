import { View } from 'react-native';

import { BonusesCard } from '@/components/dashboard/bonuses-card';
import { FamilyAlert } from '@/components/dashboard/family-alert';
import { FamilyMembersSection } from '@/components/dashboard/family-members';
import { ParentBalanceCard } from '@/components/dashboard/parent-balance-card';
import type { BonusMember, FamilyMember, ParentCard } from '@/types/dashboard';

type ParentDashboardProps = {
  card: ParentCard;
  members: FamilyMember[];
  bonuses: BonusMember[];
  pendingCount: number;
  onPressAction: (label: string) => void;
  onPressManageFamily: () => void;
  onSwitchToChild: () => void;
};

export function ParentDashboard({
  card,
  members,
  bonuses,
  pendingCount,
  onPressAction,
  onPressManageFamily,
  onSwitchToChild,
}: ParentDashboardProps) {
  return (
    <View className="gap-space-md">
      <ParentBalanceCard card={card} />

      <FamilyMembersSection
        members={members}
        onPressChild={onSwitchToChild}
        onPressMember={(member) => onPressAction(`Профиль ${member.name}`)}
        onPressManage={onPressManageFamily}
        onPressAdd={() => onPressAction('Добавить члена семьи')}
      />

      <FamilyAlert count={pendingCount} onPress={onSwitchToChild} />
      <BonusesCard members={bonuses} onPress={onPressAction} />
    </View>
  );
}

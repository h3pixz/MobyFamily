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
  childName?: string;
  pendingCount: number;
  onPressAction: (label: string, member?: BonusMember) => void;
  onPressManageFamily: () => void;
  onSwitchToChild: (childId?: string) => void;
};

export function ParentDashboard({
  card,
  members,
  bonuses,
  childName,
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
        onPressChild={(member) => onSwitchToChild(member.id)}
        onPressMember={(member) => onPressAction(`Профиль ${member.name}`)}
        onPressManage={onPressManageFamily}
      />

      <FamilyAlert count={pendingCount} childName={childName} onPress={() => onSwitchToChild()} />
      <BonusesCard members={bonuses} onPress={onPressAction} />
    </View>
  );
}

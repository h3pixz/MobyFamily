import { View } from 'react-native';

import { AddFamilyMemberCard } from '@/components/family/add-family-member-card';
import { FamilyMemberCard } from '@/components/family/family-member-card';
import { FamilySectionHeader } from '@/components/family/family-section-header';
import { FamilySecurityCard } from '@/components/family/family-security-card';
import type { FamilyMember } from '@/types/dashboard';

type FamilyManagementProps = {
  members: FamilyMember[];
  onPressAdd: () => void;
  onPressAction: (label: string) => void;
};

export function FamilyManagement({ members, onPressAdd, onPressAction }: FamilyManagementProps) {
  const children = members.filter((member) => member.kind === 'child');
  const parents = members.filter((member) => member.kind === 'parent');

  return (
    <View className="gap-space-md">
      <AddFamilyMemberCard onPress={onPressAdd} />

      <View className="gap-space-sm">
        <FamilySectionHeader
          icon="face"
          iconColor="#FB7800"
          title={`Дети (${children.length})`}
          badge="Лимит активен"
          badgeClassName="bg-surface-container"
        />
        {children.map((member) => (
          <FamilyMemberCard
            key={member.id}
            member={member}
            onPressEdit={() => onPressAction(`Профиль ${member.name}`)}
            onPressRemove={() => onPressAction(`Удалить профиль ${member.name}`)}
          />
        ))}
      </View>

      <View className="gap-space-sm">
        <FamilySectionHeader
          icon="supervisor-account"
          iconColor="#004BC3"
          title={`Родители с доступом (${parents.length})`}
          badge="Полный контроль"
          badgeClassName="bg-primary-fixed"
          badgeTextClassName="text-primary"
        />
        {parents.map((member) => (
          <FamilyMemberCard
            key={member.id}
            member={member}
            onPressEdit={() => onPressAction(`Настройки прав ${member.name}`)}
            onPressRemove={() => onPressAction(`Исключить ${member.name} из семьи`)}
          />
        ))}
      </View>

      <FamilySecurityCard />
    </View>
  );
}

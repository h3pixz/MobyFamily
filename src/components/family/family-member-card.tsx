import { Pressable, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { FamilyMember } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type FamilyMemberCardProps = {
  member: FamilyMember;
  onPressEdit: () => void;
  onPressRemove: () => void;
};

export function FamilyMemberCard({
  member,
  onPressEdit,
  onPressRemove,
}: FamilyMemberCardProps) {
  const child = member.kind === 'child';

  return (
    <Card className="flex-row items-center justify-between gap-space-md p-space-md">
      <View className="min-w-0 flex-1 flex-row items-center gap-space-sm">
        <View className="relative flex-shrink-0">
          <View
            className={`h-12 w-12 items-center justify-center rounded-full border ${
              child ? 'border-primary-fixed bg-primary-soft' : 'border-outline-variant/40 bg-surface-low'
            }`}>
            <Text className="text-[22px]">{member.emoji}</Text>
          </View>
          {!child && member.online ? (
            <View className="absolute -right-0.5 top-0 h-3 w-3 rounded-full border-2 border-surface-lowest bg-secondary-container" />
          ) : null}
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text
              numberOfLines={1}
              className="text-headline-sm font-inter-semibold text-on-surface">
              {member.name}
            </Text>
            {child ? (
              <View
                accessible
                accessibilityLabel="Moby Junior"
                className="h-2 w-2 flex-shrink-0 rounded-full bg-primary-container"
              />
            ) : (
              <View
                className={`rounded-full px-2 py-0.5 ${
                  member.online ? 'bg-surface-container' : 'bg-surface-low'
                }`}>
                <Text className="text-label-xs font-inter-semibold text-on-surface-variant">
                  {member.online ? 'В сети' : 'Не в сети'}
                </Text>
              </View>
            )}
          </View>

          {child && member.balance !== undefined ? (
            <View className="flex-row items-center gap-1">
              <Text className="text-body-sm font-inter-medium text-on-surface-variant">
                {member.roleLabel} • {formatBYN(member.balance)}
              </Text>
              <BynIcon size={10} color="#424655" />
            </View>
          ) : (
            <Text className="text-body-sm font-inter-medium text-on-surface-variant" numberOfLines={1}>
              {member.roleLabel} • Родитель
            </Text>
          )}
        </View>
      </View>

      <View className="flex-shrink-0 flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            child ? `Редактировать профиль ${member.name}` : `Настройки прав ${member.name}`
          }
          hitSlop={4}
          onPress={onPressEdit}
          className="h-10 w-10 items-center justify-center rounded-xl bg-surface-low"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
          <Icon name={child ? 'edit' : 'manage-accounts'} size={20} color="#424655" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            child ? `Удалить профиль ${member.name}` : `Исключить ${member.name} из семьи`
          }
          hitSlop={4}
          onPress={onPressRemove}
          className="h-10 w-10 items-center justify-center rounded-xl bg-error/10"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
          <Icon name={child ? 'delete' : 'person-remove'} size={20} color="#BA1A1A" />
        </Pressable>
      </View>
    </Card>
  );
}

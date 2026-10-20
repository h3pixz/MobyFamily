import { Pressable, ScrollView, Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import type { FamilyMember } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type FamilyMembersSectionProps = {
  members: FamilyMember[];
  onPressChild: () => void;
  onPressMember: (member: FamilyMember) => void;
  onPressManage: () => void;
  onPressAdd: () => void;
};

export function FamilyMembersSection({
  members,
  onPressChild,
  onPressMember,
  onPressManage,
  onPressAdd,
}: FamilyMembersSectionProps) {
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-body-md font-inter-bold text-on-surface">Члены семьи</Text>
          <View className="rounded-full bg-surface-container px-1.5 py-0.5">
            <Text className="text-label-md font-inter-semibold text-on-surface-variant">
              {members.length}
            </Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={onPressManage} hitSlop={8}>
          <Text className="text-label-md font-inter-semibold text-primary-container">
            Управление
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingVertical: 4 }}>
        {members.map((member) => {
          const child = member.kind === 'child';

          return (
            <Pressable
              key={member.id}
              accessibilityRole="button"
              accessibilityLabel={child ? `Открыть вкладку ${member.name}` : `Профиль ${member.name}`}
              onPress={() => (child ? onPressChild() : onPressMember(member))}
              className={`w-[150px] flex-col justify-between rounded-card bg-surface-lowest p-3.5 ${
                child ? 'border-2 border-primary-container' : 'border border-outline-variant/30'
              }`}
              style={({ pressed }) => [shadow, pressed ? { opacity: 0.85 } : undefined]}>
              <View className="flex-row items-start justify-between">
                <View className="relative">
                  <View
                    className={`h-11 w-11 items-center justify-center rounded-full border ${
                      child
                        ? 'border-primary-fixed bg-primary-soft'
                        : 'border-outline-variant/40 bg-surface-low'
                    }`}>
                    <Text className="text-[18px]">{member.emoji}</Text>
                  </View>
                  {member.age !== undefined ? (
                    <View className="absolute -bottom-1 -right-1 rounded-full border border-surface-lowest bg-primary-container px-1">
                      <Text className="text-[9px] font-inter-bold text-on-primary">
                        {member.age} л
                      </Text>
                    </View>
                  ) : null}
                </View>

                {child ? (
                  <View className="mt-0.5 h-2 w-2 rounded-full bg-success" />
                ) : member.online ? (
                  <View className="rounded bg-success-soft px-1.5 py-0.5">
                    <Text className="text-[10px] font-inter-semibold text-success">В сети</Text>
                  </View>
                ) : null}
              </View>

              <View className="mt-3">
                <Text className="text-label-md font-inter-bold text-on-surface">{member.name}</Text>
                <Text className="text-label-xs font-inter text-outline">{member.roleLabel}</Text>

                {member.balance !== undefined ? (
                  <View className="mt-1 flex-row items-center gap-1">
                    <Text className="text-body-md font-inter-extrabold text-primary-container">
                      {formatBYN(member.balance)}
                    </Text>
                    <BynIcon size={11} color="#1D63ED" />
                  </View>
                ) : (
                  <Text className="mt-1 text-label-sm font-inter-semibold text-outline">Родитель</Text>
                )}
              </View>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Добавить члена семьи"
          onPress={onPressAdd}
          className="w-[140px] items-center justify-center gap-2 rounded-card border-2 border-dashed border-outline-variant bg-surface-lowest p-3.5"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-low">
            <Icon name="add" size={20} color="#737686" />
          </View>
          <Text className="text-center text-label-sm font-inter-semibold leading-snug text-on-surface-variant">
            Добавить члена семьи
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

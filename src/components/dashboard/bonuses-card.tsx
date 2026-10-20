import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { BonusMember } from '@/types/dashboard';
import { formatPoints } from '@/utils/format';

type BonusesCardProps = {
  members: BonusMember[];
  onPress: (label: string) => void;
};

export function BonusesCard({ members, onPress }: BonusesCardProps) {
  const total = members.reduce((sum, member) => sum + member.points, 0);

  return (
    <Card className="gap-space-sm p-space-md">
      <View className="flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <View className="h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-warning-border bg-warning-soft">
            <Icon name="star" size={16} color="#FB7800" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-body-md font-inter-bold text-on-surface">Moby Бонусы</Text>
            <Text className="text-label-xs font-inter-medium text-outline">
              Семейная программа наград
            </Text>
          </View>
        </View>
        <Badge label={`Всего ${formatPoints(total)} б.`} tone="warning" />
      </View>

      {members.map((member) => {
        const parent = member.kind === 'parent';

        return (
          <View
            key={member.id}
            className="flex-row items-center justify-between gap-2 rounded-xl border border-outline-variant/20 bg-surface-low p-2.5">
            <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
              <View
                className={`h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  parent
                    ? 'bg-primary-container'
                    : 'border border-primary-fixed bg-primary-soft'
                }`}>
                {parent ? (
                  <Text className="text-label-sm font-inter-bold text-on-primary">
                    {member.name.charAt(0)}
                  </Text>
                ) : (
                  <Text className="text-[15px]">{member.emoji}</Text>
                )}
              </View>

              <View className="min-w-0 flex-1">
                <View className="flex-row flex-wrap items-center gap-1">
                  <Text className="text-label-md font-inter-bold text-on-surface">
                    {member.name}
                  </Text>
                  {member.roleLabel ? (
                    <Text className="text-label-xs font-inter-medium text-outline">
                      ({member.roleLabel})
                    </Text>
                  ) : null}
                  {member.goal !== undefined ? (
                    <View className="rounded border border-warning-border bg-warning-soft px-1">
                      <Text className="text-[9px] font-inter-bold text-secondary-container">
                        Цель: {formatPoints(member.goal)}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View className="mt-0.5 flex-row items-center gap-1">
                  <Text
                    className={`text-label-md font-inter-extrabold ${
                      parent ? 'text-on-surface' : 'text-secondary-container'
                    }`}>
                    {formatPoints(member.points)}
                  </Text>
                  <Text className="text-label-xs font-inter-semibold text-outline">баллов</Text>
                </View>
              </View>
            </View>

            {parent ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Потратить бонусы"
                onPress={() => onPress('Потратить бонусы')}
                className="h-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft px-2.5"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <Text className="text-label-sm font-inter-semibold text-primary-container">
                  Потратить
                </Text>
              </Pressable>
            ) : (
              <Button
                label="+ Поощрить"
                variant="warning"
                size="sm"
                className="flex-shrink-0"
                onPress={() => onPress(`Поощрить ${member.name}`)}
              />
            )}
          </View>
        );
      })}
    </Card>
  );
}

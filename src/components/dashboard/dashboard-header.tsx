import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';

type ProfileKey = 'parent' | 'child';

type DashboardHeaderProps = {
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export function DashboardHeader({
  onPressNotifications,
  onPressProfile,
}: DashboardHeaderProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileKey>('parent');

  return (
    <View className="border-b border-outline-soft/70 bg-background px-4 pb-2.5 pt-1">
      <View className="mt-1 flex-row items-center justify-between gap-2">
        <View className="flex-shrink flex-row items-center gap-2">
          <IconTile icon="account-balance-wallet" tone="solidPrimary" size="sm" />
          <View className="flex-shrink">
            <View className="flex-row items-center">
              <Text className="text-[17px] font-inter-bold tracking-tight text-on-surface">
                Moby
              </Text>
              <Text className="text-[17px] font-inter-bold tracking-tight text-primary">
                {' '}
                Family
              </Text>
            </View>
            <Text className="-mt-0.5 text-[10px] font-inter-medium text-on-surface-variant">
              МТБанк
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <View className="flex-row items-center rounded-full bg-slate-200/70 p-0.5">
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveProfile('parent')}
              className={`flex-row items-center gap-1 rounded-full px-1.5 py-1 ${
                activeProfile === 'parent' ? 'bg-card' : ''
              }`}>
              <Icon
                name="security"
                size={13}
                color={activeProfile === 'parent' ? '#1D63ED' : '#64748B'}
              />
              <Text
                className={`text-[11px] ${
                  activeProfile === 'parent'
                    ? 'font-inter-semibold text-primary'
                    : 'font-inter-medium text-on-surface-variant'
                }`}>
                Елена
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveProfile('child')}
              className={`flex-row items-center gap-1 rounded-full px-1.5 py-1 ${
                activeProfile === 'child' ? 'bg-card' : ''
              }`}>
              <Icon
                name="savings"
                size={13}
                color={activeProfile === 'child' ? '#1D63ED' : '#64748B'}
              />
              <Text
                className={`text-[11px] ${
                  activeProfile === 'child'
                    ? 'font-inter-semibold text-primary'
                    : 'font-inter-medium text-on-surface-variant'
                }`}>
                Саша
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Уведомления"
            onPress={onPressNotifications}
            className="relative h-8 w-8 items-center justify-center rounded-full border border-outline-soft bg-card">
            <Icon name="notifications" size={18} />
            <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-red-500" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Профиль"
            onPress={onPressProfile}
            className="h-8 w-8 items-center justify-center rounded-full border border-outline-soft bg-card">
            <Icon name="person" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

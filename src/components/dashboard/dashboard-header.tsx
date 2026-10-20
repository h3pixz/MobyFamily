import { Pressable, Text, View } from 'react-native';

import { BrandLogo } from '@/components/ui/brand-logo';
import { Icon } from '@/components/ui/icon';
import type { AppRole } from '@/types/dashboard';

const roles: { key: AppRole; label: string }[] = [
  { key: 'parent', label: 'Анна (Родитель)' },
  { key: 'child', label: 'Саша (Ребёнок)' },
];

type DashboardHeaderProps = {
  role: AppRole;
  onChangeRole: (role: AppRole) => void;
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export function DashboardHeader({
  role,
  onChangeRole,
  onPressNotifications,
  onPressProfile,
}: DashboardHeaderProps) {
  return (
    <View
      className="gap-space-xs bg-surface-lowest px-margin pb-2 pt-2"
      style={{
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 1 },
        elevation: 3,
      }}>
      <View className="h-12 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <BrandLogo size={40} />
          <View>
            <Text className="text-headline-sm font-inter-semibold tracking-tight text-on-surface">
              Moby Family
            </Text>
            <Text className="-mt-0.5 text-label-sm font-inter-medium text-outline">МТбанк</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Уведомления"
            onPress={onPressNotifications}
            className="relative h-11 w-11 items-center justify-center rounded-full">
            <Icon name="notifications" size={24} color="#424655" />
            <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-surface-lowest bg-secondary-container" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Профиль"
            onPress={onPressProfile}
            className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Icon name="person" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row justify-center pb-1">
        <View className="flex-row rounded-full bg-surface-container p-0.5">
          {roles.map((item) => {
            const active = role === item.key;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => onChangeRole(item.key)}
                className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-1 ${
                  active ? 'bg-primary-container' : ''
                }`}>
                {active ? <View className="h-1.5 w-1.5 rounded-full bg-surface-lowest" /> : null}
                <Text
                  className={`text-label-sm ${
                    active
                      ? 'font-inter-semibold text-on-primary'
                      : 'font-inter-medium text-on-surface-variant'
                  }`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

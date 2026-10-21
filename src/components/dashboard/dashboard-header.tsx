import { Pressable, Text, View } from 'react-native';

import { BrandLogo } from '@/components/ui/brand-logo';
import { Icon } from '@/components/ui/icon';

type DashboardHeaderProps = {
  unreadCount?: number;
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export function DashboardHeader({
  unreadCount = 0,
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
            {unreadCount > 0 ? (
              <View className="absolute right-1 top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-surface-lowest bg-secondary-container px-1">
                <Text className="text-[10px] font-inter-bold leading-none text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
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
    </View>
  );
}

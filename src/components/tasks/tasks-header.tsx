import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 1 },
  elevation: 3,
};

type TasksHeaderProps = {
  unreadCount?: number;
  onPressBack: () => void;
  onPressNotifications: () => void;
  onPressProfile: () => void;
};

export function TasksHeader({
  unreadCount = 0,
  onPressBack,
  onPressNotifications,
  onPressProfile,
}: TasksHeaderProps) {
  return (
    <View className="bg-surface-lowest" style={shadow}>
      <View className="h-16 flex-row items-center justify-between px-margin">
        <View className="min-w-0 flex-1 flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={onPressBack}
            className="-ml-2 h-11 w-11 items-center justify-center rounded-full"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
            <Icon name="arrow-back" size={24} color="#191C1E" />
          </Pressable>

          <Text
            numberOfLines={1}
            className="flex-1 text-headline-sm font-inter-semibold tracking-tight text-on-surface">
            Задания
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Уведомления"
            onPress={onPressNotifications}
            className="relative h-11 w-11 items-center justify-center rounded-full">
            <Icon name="notifications" size={22} color="#424655" />
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
            className="h-8 w-8 items-center justify-center rounded-full bg-primary"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
            <Icon name="person" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

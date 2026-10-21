import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 1 },
  elevation: 3,
};

type FamilyHeaderProps = {
  title?: string;
  onPressBack: () => void;
  onPressProfile: () => void;
};

export function FamilyHeader({
  title = 'Управление семьёй',
  onPressBack,
  onPressProfile,
}: FamilyHeaderProps) {
  return (
    <View className="bg-surface-lowest" style={shadow}>
      <View className="h-14 flex-row items-center justify-between px-margin">
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
          className="flex-1 px-2 text-center text-headline-sm font-inter-semibold tracking-tight text-on-surface">
          {title}
        </Text>

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
  );
}

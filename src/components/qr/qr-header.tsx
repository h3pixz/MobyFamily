import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';

type QrHeaderProps = {
  torchOn: boolean;
  onToggleTorch: () => void;
  onPressBack: () => void;
  onPressProfile: () => void;
};

export function QrHeader({ torchOn, onToggleTorch, onPressBack, onPressProfile }: QrHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-inverse-surface" style={{ paddingTop: insets.top }}>
      <View className="h-16 flex-row items-center justify-between px-margin">
        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={onPressBack}
            className="-ml-2 h-11 w-11 items-center justify-center rounded-full"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
            <Icon name="arrow-back" size={24} color="#F0F1F3" />
          </Pressable>
          <Text className="text-headline-sm font-inter-semibold tracking-tight text-inverse-on-surface">
            QR Scanner
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={torchOn ? 'Выключить фонарик' : 'Включить фонарик'}
            accessibilityState={{ selected: torchOn }}
            onPress={onToggleTorch}
            className={`h-11 w-11 items-center justify-center rounded-full ${
              torchOn ? 'bg-primary-container' : ''
            }`}
            style={({ pressed }) => (pressed && !torchOn ? { opacity: 0.7 } : undefined)}>
            <Icon name={torchOn ? 'flash-off' : 'flash-on'} size={22} color="#F0F1F3" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Профиль"
            onPress={onPressProfile}
            className="ml-1 h-8 w-8 items-center justify-center rounded-full bg-primary"
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
            <Icon name="person" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

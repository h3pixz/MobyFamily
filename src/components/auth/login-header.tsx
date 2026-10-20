import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type LoginHeaderProps = {
  onPressSupport: () => void;
};

export function LoginHeader({ onPressSupport }: LoginHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center gap-2">
        <View
          className="rounded-xl bg-primary-container px-2.5 py-1"
          style={shadow}>
          <Text className="text-headline-sm font-inter-semibold tracking-tight text-on-primary">
            Moby
          </Text>
        </View>

        <View>
          <View className="self-start rounded bg-secondary-fixed px-1.5 py-0.5">
            <Text className="text-[10px] font-inter-bold uppercase leading-none tracking-wider text-on-secondary-fixed">
              Family
            </Text>
          </View>
          <Text className="mt-0.5 text-[9px] font-inter-semibold uppercase tracking-widest text-on-surface-variant">
            МТБАНК
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Служба поддержки"
        onPress={onPressSupport}
        className="h-9 w-9 items-center justify-center rounded-full bg-surface-lowest"
        style={({ pressed }) => [shadow, pressed ? { opacity: 0.85 } : undefined]}>
        <Icon name="headset-mic" size={18} color="#424655" />
      </Pressable>
    </View>
  );
}

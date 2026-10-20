import { Pressable, Text, View } from 'react-native';

type AuthSwitchProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthSwitch({ prompt, actionLabel, onPress }: AuthSwitchProps) {
  return (
    <View className="items-center px-4 pt-5">
      <View className="flex-row flex-wrap items-center justify-center">
        <Text className="text-body-md font-inter text-on-surface-variant">{prompt} </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onPress}
          hitSlop={8}>
          <Text className="text-label-lg font-inter-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

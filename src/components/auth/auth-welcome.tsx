import { Text, View } from 'react-native';

type AuthWelcomeProps = {
  title: string;
  emoji: string;
  subtitle: string;
};

export function AuthWelcome({ title, emoji, subtitle }: AuthWelcomeProps) {
  return (
    <View className="px-4 pb-2 pt-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-headline-lg font-inter-bold text-on-surface">{title}</Text>
        <Text className="text-[18px]">{emoji}</Text>
      </View>
      <Text className="mt-1 text-body-md font-inter text-on-surface-variant">{subtitle}</Text>
    </View>
  );
}

import { Text, View } from 'react-native';

export function AuthWelcome() {
  return (
    <View className="px-4 pb-2 pt-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-headline-lg font-inter-bold text-on-surface">Добро пожаловать!</Text>
        <Text className="text-[18px]">✨</Text>
      </View>
      <Text className="mt-1 text-body-md text-on-surface-variant">
        Единый вход в семейный банкинг МТБанка
      </Text>
    </View>
  );
}

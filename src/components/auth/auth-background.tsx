import { View } from 'react-native';

export function AuthBackground() {
  return (
    <View pointerEvents="none" className="absolute inset-x-0 top-0 h-96 overflow-hidden">
      <View className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-container/5" />
      <View
        className="absolute -left-10 -top-8 h-40 w-40 rounded-2xl bg-primary-container/5"
        style={{ transform: [{ rotate: '25deg' }] }}
      />
      <View className="absolute right-16 top-44 h-2 w-2 rounded-full bg-primary-container/25" />
      <View className="absolute right-24 top-56 h-1.5 w-1.5 rounded-full bg-primary-container/15" />
    </View>
  );
}

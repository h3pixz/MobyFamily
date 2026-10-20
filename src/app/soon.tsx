import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';

export default function SoonScreen() {
  const params = useLocalSearchParams();
  const title = typeof params.title === 'string' ? params.title : 'Раздел';

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: '#F4F5F8' }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-outline-soft bg-card">
          <Icon name="chevron-left" size={24} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-inter-bold text-on-surface" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="text-center text-[14px] font-inter-semibold text-on-surface">
          Раздел в разработке
        </Text>
        <Text className="text-center text-[12px] font-inter text-on-surface-variant">
          Здесь появится экран, когда будет готов его дизайн.
        </Text>
      </View>
    </SafeAreaView>
  );
}

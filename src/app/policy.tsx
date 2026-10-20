import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { policyBlocks, policyHeading, policyTitle } from '@/data/policy';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

export default function PolicyScreen() {
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-outline-soft bg-card">
          <Icon name="chevron-left" size={24} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-inter-bold text-on-surface" numberOfLines={1}>
          {policyTitle}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="mx-4 gap-3 rounded-2xl bg-surface-lowest p-5" style={shadow}>
          <Text className="text-headline-sm font-inter-semibold text-on-surface">
            {policyHeading}
          </Text>

          {policyBlocks.map((block, index) => {
            if (block.kind === 'clause' || block.kind === 'subclause') {
              return (
                <View
                  key={index}
                  className={`flex-row gap-2 ${block.kind === 'subclause' ? 'pl-4' : ''}`}>
                  <Text className="min-w-[24px] text-body-md font-inter-semibold text-on-surface">
                    {block.number}
                  </Text>
                  <Text className="flex-1 text-body-md font-inter text-on-surface">{block.text}</Text>
                </View>
              );
            }

            if (block.kind === 'bullet') {
              return (
                <View key={index} className="flex-row gap-2 pl-4">
                  <Text className="text-body-md font-inter text-on-surface">•</Text>
                  <Text className="flex-1 text-body-md font-inter text-on-surface">{block.text}</Text>
                </View>
              );
            }

            return (
              <Text key={index} className="pl-4 text-body-md font-inter text-on-surface">
                {block.text}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

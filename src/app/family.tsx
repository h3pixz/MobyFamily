import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/dashboard/bottom-nav';
import { FamilyHeader } from '@/components/family/family-header';
import { FamilyManagement } from '@/components/family/family-management';
import { familyMembers } from '@/data/dashboard';

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          onPressBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        <FamilyManagement
          members={familyMembers}
          onPressAdd={() => router.push('/add-member')}
          onPressAction={openSoon}
        />
      </ScrollView>

      <BottomNav
        activeTab="family"
        onPress={(tab) => {
          if (tab.key === 'profile') {
            router.push('/profile');
          } else if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </View>
  );
}

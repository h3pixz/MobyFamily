import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChildBalanceCard } from '@/components/child/child-balance-card';
import { ChildGoalCard } from '@/components/child/child-goal-card';
import { ChildQuickActions } from '@/components/child/child-quick-actions';
import { ChildTasksSection } from '@/components/child/child-tasks-section';
import { FinanceAcademyCard } from '@/components/child/finance-academy-card';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { childProfile, childQuickActions, childTasks, savingsGoal } from '@/data/dashboard';
import type { ChildQuickAction } from '@/types/dashboard';

export default function ChildScreen() {
  const insets = useSafeAreaInsets();

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const openQuickAction = (action: ChildQuickAction) => {
    if (action.id === 'child-action-qr') {
      router.push('/qr');
      return;
    }
    openSoon(action.label);
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <DashboardHeader
          onPressNotifications={() => openSoon('Уведомления')}
          onPressProfile={() => router.push('/register')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="gap-space-md">
          <View className="pt-1">
            <Text className="text-headline-md font-inter-semibold text-on-surface">
              Привет, {childProfile.name}! 👋
            </Text>
          </View>

          <ChildBalanceCard child={childProfile} />

          <ChildQuickActions actions={childQuickActions} onPress={openQuickAction} />

          <ChildGoalCard goal={savingsGoal} onAddMoney={() => openSoon('Пополнение цели')} />

          <View className="gap-gutter">
            <ChildTasksSection tasks={childTasks} onPressAll={() => openSoon('Задания')} />
            <FinanceAcademyCard onPress={() => openSoon('Фин-академия')} />
          </View>
        </View>
      </ScrollView>

      <BottomNav
        activeTab="family"
        onPress={(tab) => {
          if (tab.key === 'profile') {
            router.push('/register');
          } else if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </View>
  );
}

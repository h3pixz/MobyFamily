import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ChildSummaryCard } from '@/components/dashboard/child-summary-card';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { EventsSection } from '@/components/dashboard/events-section';
import { PointsCard } from '@/components/dashboard/points-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { SavingsGoalCard } from '@/components/dashboard/savings-goal-card';
import { TasksSection } from '@/components/dashboard/tasks-section';
import { Icon } from '@/components/ui/icon';
import {
  childProfile,
  initialTasks,
  parentPoints,
  parentProfile,
  pendingPurchase,
  recentEvents,
  savingsGoal,
} from '@/data/dashboard';
import type { PendingPurchase, Task } from '@/types/dashboard';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [approval, setApproval] = useState<PendingPurchase | null>(pendingPurchase);

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const resolveTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const resolveApproval = () => {
    setApproval(null);
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: '#F4F5F8' }}>
      <DashboardHeader
        onPressNotifications={() => openSoon('Уведомления')}
        onPressProfile={() => openSoon('Профиль')}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="pt-0.5">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[22px] font-inter-bold tracking-tight text-on-surface">
              {parentProfile.greeting}
            </Text>
            <Icon name="auto-awesome" size={18} color="#F59E0B" />
          </View>
          <View className="mt-0.5 flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-accent" />
            <Text className="text-[13px] font-inter text-on-surface-variant">
              Связь с картой ребёнка: онлайн
            </Text>
          </View>
        </View>

        <ChildSummaryCard child={childProfile} />
        <SavingsGoalCard goal={savingsGoal} onAddMoney={() => openSoon('Пополнение цели')} />
        <QuickActions onPress={openSoon} />
        <PointsCard points={parentPoints} onPress={() => openSoon('Баллы родителя')} />

        <TasksSection
          tasks={tasks}
          onConfirm={resolveTask}
          onDecline={resolveTask}
          onNewTask={() => openSoon('Новое задание')}
        />

        <EventsSection
          events={recentEvents}
          approval={approval}
          onApprove={resolveApproval}
          onDecline={resolveApproval}
          onPressHistory={() => openSoon('История событий')}
        />

        <Text className="py-2 text-center text-[12px] font-inter leading-relaxed text-on-surface-variant">
          Интерфейс не перегружен сторонними каталогами. Только семейный баланс и безопасность.
        </Text>
      </ScrollView>

      <BottomNav
        activeTab="family"
        onPress={(tab) => {
          if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </SafeAreaView>
  );
}

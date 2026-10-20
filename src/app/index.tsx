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
import { Avatar } from '@/components/ui/avatar';
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
        avatarUrl={parentProfile.avatarUrl}
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
        <View className="flex-row items-start justify-between gap-2 pt-0.5">
          <View className="flex-1">
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

          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-outline-soft bg-card">
            <Avatar
              uri={parentProfile.avatarUrl}
              size={44}
              rounded="xl"
              label={parentProfile.name}
            />
            <View className="absolute -bottom-1 -right-1 h-4 w-4 items-center justify-center rounded-full border border-outline-soft bg-card">
              <View className="h-2.5 w-2.5 rounded-full bg-accent" />
            </View>
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

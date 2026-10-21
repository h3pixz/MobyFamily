import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import type { TaskResponseDto } from '@/api/gen/models/TaskResponseDto';
import { fetchPiggyBanks } from '@/api/piggy-banks';
import { fetchTasks, submitTask } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { ChildBalanceCard } from '@/components/child/child-balance-card';
import { ChildGoalCard } from '@/components/child/child-goal-card';
import { ChildQuickActions } from '@/components/child/child-quick-actions';
import { ChildTasksSection } from '@/components/child/child-tasks-section';
import { FinanceAcademyCard } from '@/components/child/finance-academy-card';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { childQuickActions } from '@/data/dashboard';
import type { ChildQuickAction } from '@/types/dashboard';
import { toChildProfile, toChildTasks, toSavingsGoal } from '@/utils/family';
import { getFirstName } from '@/utils/greeting';

export default function ChildScreen() {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponseDto[]>([]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    let cancelled = false;

    Promise.allSettled([fetchFamily(), fetchTasks(), fetchPiggyBanks()]).then(
      ([familyResult, tasksResult, piggyBanksResult]) => {
        if (cancelled) {
          return;
        }

        if (familyResult.status === 'fulfilled') {
          setFamily(familyResult.value);
        }
        if (tasksResult.status === 'fulfilled') {
          setTasks(tasksResult.value);
        }
        if (piggyBanksResult.status === 'fulfilled') {
          setPiggyBanks(piggyBanksResult.value);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [profile]);

  const child = family ? toChildProfile(family.user) : null;
  const activeTasks = toChildTasks(tasks);
  const activePiggyBank = piggyBanks.find((piggyBank) => piggyBank.status === 'ACTIVE');
  const firstName = getFirstName(family?.user.name ?? profile?.name);

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

  const handleSubmitTask = async (taskId: string) => {
    try {
      await submitTask(taskId);
    } catch {
      return;
    }

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: 'SUBMITTED' } : task)),
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <DashboardHeader
          onPressNotifications={() => openSoon('Уведомления')}
          onPressProfile={() => router.push('/profile')}
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
              Привет, {firstName}! 👋
            </Text>
          </View>

          {child ? <ChildBalanceCard child={child} /> : null}

          <ChildQuickActions actions={childQuickActions} onPress={openQuickAction} />

          {activePiggyBank ? (
            <ChildGoalCard
              goal={toSavingsGoal(activePiggyBank)}
              onAddMoney={() => openSoon('Пополнение цели')}
            />
          ) : null}

          <View className="gap-gutter">
            <ChildTasksSection
              tasks={activeTasks}
              onSubmit={handleSubmitTask}
              onPressAll={() => openSoon('Задания')}
            />
            <FinanceAcademyCard onPress={() => openSoon('Фин-академия')} />
          </View>
        </View>
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

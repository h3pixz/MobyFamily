import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily, fetchGraduationStatus } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import type { GraduationStatusResponseDto } from '@/api/gen/models/GraduationStatusResponseDto';
import type { MemberTransactionsResponseDto } from '@/api/gen/models/MemberTransactionsResponseDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import type { TaskResponseDto } from '@/api/gen/models/TaskResponseDto';
import { fetchMyTransactions } from '@/api/payments';
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
import { TeenBalanceCard } from '@/components/teen/teen-balance-card';
import { TeenBottomNav } from '@/components/teen/teen-bottom-nav';
import { TeenGoalCard } from '@/components/teen/teen-goal-card';
import { TeenQuestCard } from '@/components/teen/teen-quest-card';
import { TeenQuickActions } from '@/components/teen/teen-quick-actions';
import { TeenTransactions } from '@/components/teen/teen-transactions';
import { childQuickActions } from '@/data/dashboard';
import { teenQuickActions } from '@/data/teen';
import type { ChildQuickAction, TeenQuickAction } from '@/types/dashboard';
import { toChildProfile, toChildTasks, toSavingsGoal } from '@/utils/family';
import { getFirstName } from '@/utils/greeting';
import { getMonthsUntilAge } from '@/utils/teen';

export default function ChildScreen() {
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const isTeen = profile?.role === 'TEEN_14_17';
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [tasks, setTasks] = useState<TaskResponseDto[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponseDto[]>([]);
  const [transactions, setTransactions] = useState<MemberTransactionsResponseDto | null>(null);
  const [graduation, setGraduation] = useState<GraduationStatusResponseDto | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!profile) {
        return;
      }

      let cancelled = false;

      if (isTeen) {
        Promise.allSettled([
          fetchFamily(),
          fetchPiggyBanks(),
          fetchMyTransactions(6),
          fetchGraduationStatus(),
        ]).then(([familyResult, piggyBanksResult, transactionsResult, graduationResult]) => {
          if (cancelled) {
            return;
          }

          if (familyResult.status === 'fulfilled') {
            setFamily(familyResult.value);
          }
          if (piggyBanksResult.status === 'fulfilled') {
            setPiggyBanks(piggyBanksResult.value);
          }
          if (transactionsResult.status === 'fulfilled') {
            setTransactions(transactionsResult.value);
          }
          if (graduationResult.status === 'fulfilled') {
            setGraduation(graduationResult.value);
          }
        });
      } else {
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
      }

      return () => {
        cancelled = true;
      };
    }, [isTeen, profile]),
  );

  const child = family ? toChildProfile(family.user) : null;
  const activeTasks = toChildTasks(tasks);
  const activePiggyBanks = piggyBanks.filter((piggyBank) => piggyBank.status === 'ACTIVE');
  const activePiggyBank = activePiggyBanks[0];
  const firstName = getFirstName(family?.user.name ?? profile?.name);

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const openTopUp = (piggyBankId: string) => {
    router.push({ pathname: '/piggy-bank-top-up', params: { id: piggyBankId } });
  };

  const openQuickAction = (action: ChildQuickAction) => {
    if (action.id === 'child-action-qr') {
      router.push('/qr');
      return;
    }
    openSoon(action.label);
  };

  const openTeenAction = (action: TeenQuickAction) => {
    if (action.id === 'teen-qr') {
      router.push('/qr');
      return;
    }
    if (action.id === 'teen-tasks') {
      router.push('/tasks');
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
        {isTeen ? (
          <>
            {child ? (
              <TeenBalanceCard
                ageLabel="14–17 лет (Самостоятельный)"
                cardLast4={child.cardLast4}
                cardNumberMask={family?.user.cards[0]?.cardNumberMask}
                balance={child.purchaseBalance}
                savings={activePiggyBanks.reduce(
                  (sum, piggyBank) => sum + piggyBank.currentAmount,
                  0,
                )}
              />
            ) : null}

            <TeenQuickActions actions={teenQuickActions} onPress={openTeenAction} />

            {graduation ? (
              <TeenQuestCard
                status={graduation}
                monthsLeft={family ? getMonthsUntilAge(family.user.birthDay, 18) : 0}
                onPress={() => openSoon('Квесты')}
              />
            ) : null}

            {activePiggyBank ? (
              <TeenGoalCard
                piggyBank={activePiggyBank}
                activeCount={activePiggyBanks.length}
                onAddMoney={() => openTopUp(activePiggyBank.id)}
              />
            ) : null}

            {transactions ? (
              <TeenTransactions
                transactions={transactions.transactions}
                onPressAll={() => router.push('/transaction-history')}
              />
            ) : null}
          </>
        ) : (
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
                onAddMoney={() => openTopUp(activePiggyBank.id)}
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
        )}
      </ScrollView>

      {isTeen ? (
        <TeenBottomNav
          activeTab="home"
          onPress={(tab) => {
            if (tab.key === 'profile') {
              router.push('/profile');
            } else if (tab.key !== 'home') {
              openSoon(tab.label);
            }
          }}
        />
      ) : (
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
      )}
    </View>
  );
}

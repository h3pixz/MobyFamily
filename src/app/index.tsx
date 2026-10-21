import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, PanResponder, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import type { TaskResponseDto } from '@/api/gen/models/TaskResponseDto';
import type { TransferRequestListItemDto } from '@/api/gen/models/TransferRequestListItemDto';
import { approveTransferRequest, fetchTransferRequests } from '@/api/payments';
import { fetchPiggyBanks } from '@/api/piggy-banks';
import { approveTask, fetchTasks } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ChildDashboard } from '@/components/dashboard/child-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import { useUnreadCount } from '@/hooks/use-unread-count';
import type { AppRole, BonusMember, DecisionRequest } from '@/types/dashboard';
import {
  toChildProfile,
  toChildTasks,
  toFamilyMember,
  toSavingsGoal,
  toSelfParentMember,
  toTaskDecision,
  toTransferDecision,
} from '@/utils/family';
import { getFirstName } from '@/utils/greeting';

export default function HomeScreen() {
  const { profile } = useAuth();
  const unreadCount = useUnreadCount();
  const [role, setRole] = useState<AppRole>('parent');
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponseDto[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequestListItemDto[]>([]);
  const [apiTasks, setApiTasks] = useState<TaskResponseDto[]>([]);
  const [busyDecisionId, setBusyDecisionId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      if (!profile) {
        return;
      }

      void reloadKey;

      let cancelled = false;

      Promise.allSettled([
        fetchFamily(),
        fetchPiggyBanks(),
        fetchTransferRequests(),
        fetchTasks(),
      ]).then(([familyResult, piggyBanksResult, requestsResult, tasksResult]) => {
        if (cancelled) {
          return;
        }

        if (familyResult.status === 'fulfilled') {
          setFamily(familyResult.value);
        }
        if (piggyBanksResult.status === 'fulfilled') {
          setPiggyBanks(piggyBanksResult.value);
        }
        if (requestsResult.status === 'fulfilled') {
          setTransferRequests(requestsResult.value);
        }
        if (tasksResult.status === 'fulfilled') {
          setApiTasks(tasksResult.value);
        }
      });

      return () => {
        cancelled = true;
      };
    }, [profile, reloadKey]),
  );

  const parentApiCard = family?.user.cards[0];
  const parentCardData = {
    title: 'Moby карта',
    last4: parentApiCard ? parentApiCard.cardNumberMask.slice(-4) : '••••',
    balance: parentApiCard?.balance ?? 0,
  };
  const children = family?.children ?? [];
  const selectedChild =
    children.find((child) => child.id === selectedChildId) ?? children[0] ?? null;
  const childProfile = selectedChild ? toChildProfile(selectedChild) : null;
  const activePiggyBanks = selectedChild
    ? piggyBanks.filter(
        (piggyBank) => piggyBank.owner.id === selectedChild.id && piggyBank.status === 'ACTIVE',
      )
    : [];
  const activeGoal = activePiggyBanks[0];
  const savingsGoal = activeGoal ? toSavingsGoal(activeGoal) : null;
  const savingsBalance = activePiggyBanks.reduce(
    (sum, piggyBank) => sum + piggyBank.currentAmount,
    0,
  );
  const members = family
    ? [...children.map(toFamilyMember), toSelfParentMember(family.user)]
    : children.map(toFamilyMember);
  const bonuses = [
    {
      id: 'bonus-parent',
      kind: 'parent' as const,
      name: profile?.name ?? 'Родитель',
      roleLabel: 'Родитель',
      points: profile?.mobiksBalance ?? 0,
    },
    ...children.map((child) => ({
      id: child.id,
      kind: 'child' as const,
      emoji: '👦🏻',
      name: getFirstName(child.name),
      points: child.mobiksBalance,
    })),
  ];
  const pendingTransfers = transferRequests.filter((request) => request.status === 'PENDING');
  const submittedTasks = apiTasks.filter((task) => task.status === 'SUBMITTED');
  const allPendingCount = pendingTransfers.length + submittedTasks.length;
  const visibleTransfers =
    role === 'parent'
      ? pendingTransfers
      : pendingTransfers.filter((request) => request.child?.id === selectedChild?.id);
  const visibleTasks =
    role === 'parent'
      ? submittedTasks
      : submittedTasks.filter(
          (task) => (task.completedBy?.id ?? task.assignedChild?.id) === selectedChild?.id,
        );
  const decisions = [
    ...visibleTransfers.map(toTransferDecision),
    ...visibleTasks.map(toTaskDecision),
  ];
  const previewTasks = selectedChild
    ? toChildTasks(
        apiTasks.filter(
          (task) =>
            task.assignedChild?.id === selectedChild.id ||
            task.completedBy?.id === selectedChild.id ||
            (!task.assignedChild && !task.completedBy),
        ),
      )
    : [];

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const openTopUp = () => {
    if (activeGoal) {
      router.push({ pathname: '/piggy-bank-top-up', params: { id: activeGoal.id } });
      return;
    }
    router.push('/piggy-banks');
  };

  const openChildHistory = () => {
    if (!selectedChild) {
      return;
    }

    router.push({ pathname: '/child-history', params: { childId: selectedChild.id } });
  };

  const openLimitSettings = () => {
    const card = selectedChild?.cards[0];

    if (!card) {
      openSoon('Настройка лимитов');
      return;
    }

    router.push({ pathname: '/limit-settings', params: { cardId: card.id } });
  };

  const changeRole = (next: AppRole) => {
    setRole(next);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [role]);

  const handleParentAction = (label: string, member?: BonusMember) => {
    if (member?.kind === 'child') {
      router.push({
        pathname: '/transfer',
        params: { mode: 'child', childId: member.id },
      });
      return;
    }

    if (label === 'Потратить бонусы') {
      router.push('/bonuses');
      return;
    }

    if (label.startsWith('Профиль')) {
      router.push('/profile');
      return;
    }

    openSoon(label);
  };

  const handleApproveDecision = async (decision: DecisionRequest) => {
    if (!decision.source || !decision.rawId) {
      return;
    }

    setBusyDecisionId(decision.id);

    try {
      if (decision.source === 'transfer') {
        await approveTransferRequest(decision.rawId, parentApiCard?.id);
      } else {
        await approveTask(decision.rawId);
      }

      setReloadKey((current) => current + 1);
    } catch (error) {
      Alert.alert('Не удалось подтвердить', getApiErrorMessage(error));
    } finally {
      setBusyDecisionId(null);
    }
  };

  const handleDeclineDecision = (decision: DecisionRequest) => {
    if (!decision.source || !decision.rawId) {
      return;
    }

    router.push({
      pathname: '/decision-reason',
      params: { kind: decision.source, id: decision.rawId, title: decision.title },
    });
  };

  const switchToChild = (childId?: string) => {
    const target = childId
      ? children.find((child) => child.id === childId)
      : selectedChild;

    if (!target) {
      return;
    }

    setSelectedChildId(target.id);
    changeRole('child');
  };

  const swipeBack = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          gesture.dx > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > 70) {
            setRole('parent');
          }
        },
      }),
    [],
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: '#F8F9FB' }}
      {...(role === 'child' ? swipeBack.panHandlers : {})}>
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <DashboardHeader
          unreadCount={unreadCount}
          onPressNotifications={() => router.push('/notifications')}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}>
        {role === 'parent' ? (
          <Animated.View key="parent" entering={FadeInLeft.duration(220)}>
            <ParentDashboard
              card={parentCardData}
              members={members}
              bonuses={bonuses}
              childName={childProfile?.name}
              pendingCount={allPendingCount}
              onPressAction={handleParentAction}
              onPressManageFamily={() => router.push('/family')}
              onSwitchToChild={switchToChild}
            />
          </Animated.View>
        ) : childProfile ? (
          <Animated.View key="child" entering={FadeInRight.duration(280)}>
            <ChildDashboard
              child={childProfile}
              savingsBalance={savingsBalance}
              activeGoals={activePiggyBanks.length}
              decisions={decisions}
              tasks={previewTasks}
              goal={savingsGoal}
              busyDecisionId={busyDecisionId}
              onApprove={handleApproveDecision}
              onDecline={handleDeclineDecision}
              onPressHistory={openChildHistory}
              onPressPocketMoney={openLimitSettings}
              onNewTask={() => router.push('/new-task')}
              onAddMoney={openTopUp}
            />
          </Animated.View>
        ) : null}
      </ScrollView>

      <BottomNav
        activeTab="family"
        onPress={(tab) => {
          if (tab.key === 'profile') {
            router.push('/profile');
          } else if (tab.key === 'savings') {
            router.push('/piggy-banks');
          } else if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </View>
  );
}

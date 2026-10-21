import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { PanResponder, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { fetchPiggyBanks } from '@/api/piggy-banks';
import { useAuth } from '@/auth/auth-context';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ChildDashboard } from '@/components/dashboard/child-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import {
  childBonusMember,
  childTasks,
  familyParentMember,
  getInitialDecisions,
  parentBonusMember,
  parentCard,
} from '@/data/dashboard';
import type { AppRole } from '@/types/dashboard';
import { toChildProfile, toFamilyMember, toSavingsGoal } from '@/utils/family';
import { getFirstName } from '@/utils/greeting';

export default function HomeScreen() {
  const { profile } = useAuth();
  const [role, setRole] = useState<AppRole>('parent');
  const [resolvedDecisions, setResolvedDecisions] = useState<string[]>([]);
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponseDto[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      if (!profile) {
        return;
      }

      let cancelled = false;

      Promise.allSettled([fetchFamily(), fetchPiggyBanks()]).then(
        ([familyResult, piggyBanksResult]) => {
          if (cancelled) {
            return;
          }

          if (familyResult.status === 'fulfilled') {
            setFamily(familyResult.value);
          }
          if (piggyBanksResult.status === 'fulfilled') {
            setPiggyBanks(piggyBanksResult.value);
          }
        },
      );

      return () => {
        cancelled = true;
      };
    }, [profile]),
  );

  const parentApiCard = family?.user.cards[0];
  const parentCardData = parentApiCard
    ? {
        ...parentCard,
        last4: parentApiCard.cardNumberMask.slice(-4),
        balance: parentApiCard.balance,
      }
    : parentCard;
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
  const childName = childProfile?.name ?? 'Ребёнок';
  const members = [...children.map(toFamilyMember), familyParentMember];
  const bonuses = [
    parentBonusMember,
    ...children.map((child) => ({
      ...childBonusMember,
      id: `bonus-${child.id}`,
      name: getFirstName(child.name),
      points: child.mobiksBalance,
    })),
  ];
  const decisions = getInitialDecisions(childName).filter(
    (request) => !resolvedDecisions.includes(request.id),
  );

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const openTopUp = () => {
    if (activeGoal) {
      router.push({ pathname: '/piggy-bank-top-up', params: { id: activeGoal.id } });
      return;
    }
    openSoon('Пополнение цели');
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
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const resolveDecision = (id: string) => {
    setResolvedDecisions((current) => [...current, id]);
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

  const swipeBack = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        gesture.dx > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 70) {
          changeRole('parent');
        }
      },
    }),
  ).current;

  return (
    <View
      style={{ flex: 1, backgroundColor: '#F8F9FB' }}
      {...(role === 'child' ? swipeBack.panHandlers : {})}>
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <DashboardHeader
          onPressNotifications={() => openSoon('Уведомления')}
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
              pendingCount={decisions.length}
              onPressAction={openSoon}
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
              tasks={childTasks}
              goal={savingsGoal}
              onApprove={resolveDecision}
              onDecline={resolveDecision}
              onPressAction={openSoon}
              onPressPocketMoney={openLimitSettings}
              onNewTask={() => openSoon('Новое задание')}
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
          } else if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </View>
  );
}

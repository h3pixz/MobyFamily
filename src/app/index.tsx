import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { PanResponder, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ChildDashboard } from '@/components/dashboard/child-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import {
  accounts,
  bonusMembers,
  childProfile,
  childTasks,
  familyMembers,
  initialDecisions,
  parentCard,
  parentProfile,
  quickPayments,
  savingsGoal,
} from '@/data/dashboard';
import type { AppRole, DecisionRequest } from '@/types/dashboard';

export default function HomeScreen() {
  const [role, setRole] = useState<AppRole>('parent');
  const [decisions, setDecisions] = useState<DecisionRequest[]>(initialDecisions);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const changeRole = (next: AppRole) => {
    setRole(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const resolveDecision = (id: string) => {
    setDecisions((current) => current.filter((request) => request.id !== id));
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
          onPressProfile={() => router.push('/register')}
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
              card={parentCard}
              members={familyMembers}
              bonuses={bonusMembers}
              accounts={accounts}
              quickPayments={quickPayments}
              pendingCount={decisions.length}
              onPressAction={openSoon}
              onPressManageFamily={() => router.push('/family')}
              onSwitchToChild={() => changeRole('child')}
            />
          </Animated.View>
        ) : (
          <Animated.View key="child" entering={FadeInRight.duration(280)}>
            <ChildDashboard
              greeting={parentProfile.greeting}
              child={childProfile}
              decisions={decisions}
              tasks={childTasks}
              goal={savingsGoal}
              onApprove={resolveDecision}
              onDecline={resolveDecision}
              onPressAction={openSoon}
              onNewTask={() => openSoon('Новое задание')}
              onAddMoney={() => openSoon('Пополнение цели')}
            />
          </Animated.View>
        )}
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

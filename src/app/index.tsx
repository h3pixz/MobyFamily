import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
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
  savingsGoal,
} from '@/data/dashboard';
import type { AppRole } from '@/types/dashboard';
import { toChildProfile, toFamilyMember } from '@/utils/family';
import { getGreeting } from '@/utils/greeting';

export default function HomeScreen() {
  const { profile } = useAuth();
  const [role, setRole] = useState<AppRole>('parent');
  const [resolvedDecisions, setResolvedDecisions] = useState<string[]>([]);
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!profile) {
      return;
    }

    let cancelled = false;

    fetchFamily()
      .then((data) => {
        if (!cancelled) {
          setFamily(data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [profile]);

  const familyChild = family?.children[0];
  const childProfile = familyChild ? toChildProfile(familyChild) : null;
  const childName = childProfile?.name ?? 'Ребёнок';
  const members = familyChild
    ? [toFamilyMember(familyChild), familyParentMember]
    : [familyParentMember];
  const bonuses = childProfile
    ? [parentBonusMember, { ...childBonusMember, name: childProfile.name }]
    : [parentBonusMember];
  const decisions = getInitialDecisions(childName).filter(
    (request) => !resolvedDecisions.includes(request.id),
  );

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const changeRole = (next: AppRole) => {
    setRole(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const resolveDecision = (id: string) => {
    setResolvedDecisions((current) => [...current, id]);
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
              card={parentCard}
              members={members}
              bonuses={bonuses}
              childName={childProfile?.name}
              pendingCount={decisions.length}
              onPressAction={openSoon}
              onPressManageFamily={() => router.push('/family')}
              onSwitchToChild={() => {
                if (childProfile) {
                  changeRole('child');
                }
              }}
            />
          </Animated.View>
        ) : childProfile ? (
          <Animated.View key="child" entering={FadeInRight.duration(280)}>
            <ChildDashboard
              greeting={getGreeting(familyChild?.name)}
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

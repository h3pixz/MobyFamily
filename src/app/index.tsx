import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ChildDashboard } from '@/components/dashboard/child-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ParentDashboard } from '@/components/dashboard/parent-dashboard';
import {
  accounts,
  cardSettings,
  childProfile,
  childTasks,
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <DashboardHeader
        role={role}
        onChangeRole={changeRole}
        onPressNotifications={() => openSoon('Уведомления')}
        onPressProfile={() => openSoon('Профиль')}
      />

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}>
        {role === 'parent' ? (
          <ParentDashboard
            profile={parentProfile}
            card={parentCard}
            accounts={accounts}
            quickPayments={quickPayments}
            pendingCount={decisions.length}
            onPressAction={openSoon}
            onSwitchToChild={() => changeRole('child')}
          />
        ) : (
          <ChildDashboard
            child={childProfile}
            decisions={decisions}
            tasks={childTasks}
            goal={savingsGoal}
            cardSettings={cardSettings}
            onApprove={resolveDecision}
            onDecline={resolveDecision}
            onPressAction={openSoon}
            onNewTask={() => openSoon('Новое задание')}
            onAddMoney={() => openSoon('Пополнение цели')}
          />
        )}
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

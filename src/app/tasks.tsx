import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchTasks, submitTask } from '@/api/tasks';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskEarningsCard } from '@/components/tasks/task-earnings-card';
import { TaskFilterChips } from '@/components/tasks/task-filter-chips';
import { TasksBottomNav } from '@/components/tasks/tasks-bottom-nav';
import { TasksHeader } from '@/components/tasks/tasks-header';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useUnreadCount } from '@/hooks/use-unread-count';
import type { TaskFilter, TaskItem } from '@/types/tasks';
import {
  filterTasksByStatus,
  getMonthlyEarnings,
  getTaskProgress,
  toTaskItem,
} from '@/utils/tasks';

const EMPTY_STATES: Record<TaskFilter, { title: string; subtitle: string }> = {
  active: {
    title: 'Активных заданий нет',
    subtitle: 'Новые поручения от родителей появятся здесь.',
  },
  review: {
    title: 'Заданий на проверке нет',
    subtitle: 'Отправленные отчёты будут ждать подтверждения здесь.',
  },
  done: {
    title: 'Завершённых заданий пока нет',
    subtitle: 'Выполненные задания появятся здесь.',
  },
};

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const unreadCount = useUnreadCount();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchTasks()
        .then((response) => {
          if (cancelled) {
            return;
          }

          setTasks(response.filter((task) => task.status !== 'CANCELLED').map(toTaskItem));
          setError(null);
        })
        .catch(() => {
          if (!cancelled) {
            setError('Не удалось загрузить задания');
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const handleSubmit = async (taskId: string) => {
    setSubmittingId(taskId);

    try {
      await submitTask(taskId);

      const submittedAt = new Date().toISOString();

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? { ...task, status: 'review', submittedAt, updatedAt: submittedAt }
            : task,
        ),
      );
    } catch {
      Alert.alert('Не удалось отправить задание', 'Попробуйте ещё раз.');
    } finally {
      setSubmittingId(null);
    }
  };

  const activeTasks = filterTasksByStatus(tasks, 'active');
  const reviewTasks = filterTasksByStatus(tasks, 'review');
  const visibleTasks = filterTasksByStatus(tasks, filter);
  const progress = getTaskProgress(tasks);
  const earnings = getMonthlyEarnings(tasks);
  const emptyState = EMPTY_STATES[filter];

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <TasksHeader
          unreadCount={unreadCount}
          onPressBack={goBack}
          onPressNotifications={() => router.push('/notifications')}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="small" color="#1D63ED" />
          </View>
        ) : error ? (
          <View className="items-center gap-2 py-16">
            <Icon name="error-outline" size={28} color="#BA1A1A" />
            <Text className="text-center text-body-md font-inter text-on-surface-variant">
              {error}
            </Text>
          </View>
        ) : (
          <>
            <TaskFilterChips
              value={filter}
              activeCount={activeTasks.length}
              reviewCount={reviewTasks.length}
              onChange={setFilter}
            />

            <TaskEarningsCard
              earned={earnings}
              completed={progress.completed}
              total={progress.total}
              percent={progress.percent}
            />

            <View className="flex-row items-center justify-between gap-2 pt-1">
              <Text className="text-headline-sm font-inter-semibold text-on-surface">
                Текущие поручения
              </Text>
              <Text className="text-label-md font-inter-medium text-on-surface-variant">
                Всего: {visibleTasks.length}
              </Text>
            </View>

            {visibleTasks.length === 0 ? (
              <Card className="gap-1 p-margin">
                <Text className="text-center text-label-lg font-inter-semibold text-on-surface">
                  {emptyState.title}
                </Text>
                <Text className="text-center text-body-sm font-inter text-on-surface-variant">
                  {emptyState.subtitle}
                </Text>
              </Card>
            ) : (
              visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  submitting={submittingId === task.id}
                  onSubmit={() => handleSubmit(task.id)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

      <TasksBottomNav
        onPress={(tab) => {
          if (tab.key === 'home') {
            goBack();
          } else if (tab.key === 'piggy') {
            router.push({ pathname: '/soon', params: { title: tab.label } });
          } else if (tab.key === 'profile') {
            router.push('/profile');
          }
        }}
      />
    </View>
  );
}

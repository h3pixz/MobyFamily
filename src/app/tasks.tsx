import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { approveTask, cancelTask, fetchTasks } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskEarningsCard } from '@/components/tasks/task-earnings-card';
import { TaskFilterChips } from '@/components/tasks/task-filter-chips';
import { TasksBottomNav } from '@/components/tasks/tasks-bottom-nav';
import { TasksHeader } from '@/components/tasks/tasks-header';
import { Button } from '@/components/ui/button';
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

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const unreadCount = useUnreadCount();
  const { profile } = useAuth();
  const isParent = !isChildRole(profile?.role ?? '');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      setLoading(true);

      fetchTasks()
        .then((response) => {
          if (cancelled) {
            return;
          }

          setTasks(
            response
              .filter((task) => task.status !== 'CANCELLED')
              .map(toTaskItem),
          );
          setError(null);
        })
        .catch((loadError) => {
          if (!cancelled) {
            setError(getApiErrorMessage(loadError));
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
    }, [reloadKey]),
  );

  const reload = () => setReloadKey((current) => current + 1);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isParent ? '/' : '/child');
  };

  const handleSubmit = (taskId: string) => {
    router.push({ pathname: '/submit-task', params: { id: taskId } });
  };

  const handleApprove = async (task: TaskItem) => {
    setBusyId(task.id);

    try {
      await approveTask(task.id);
      reload();
    } catch (approveError) {
      Alert.alert('Не удалось подтвердить задание', getApiErrorMessage(approveError));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = (task: TaskItem) => {
    router.push({
      pathname: '/decision-reason',
      params: { kind: 'task', id: task.id, title: task.title },
    });
  };

  const handleCancel = (task: TaskItem) => {
    Alert.alert(
      'Отменить задание?',
      'Зарезервированное вознаграждение вернётся на карту родителя.',
      [
        { text: 'Оставить', style: 'cancel' },
        {
          text: 'Отменить задание',
          style: 'destructive',
          onPress: async () => {
            setBusyId(task.id);

            try {
              await cancelTask(task.id);
              reload();
            } catch (cancelError) {
              Alert.alert('Не удалось отменить задание', getApiErrorMessage(cancelError));
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  };

  const activeTasks = filterTasksByStatus(tasks, 'active');
  const reviewTasks = filterTasksByStatus(tasks, 'review');
  const visibleTasks = filterTasksByStatus(tasks, filter);
  const progress = getTaskProgress(tasks);
  const earnings = getMonthlyEarnings(tasks);
  const emptyState =
    filter === 'active'
      ? {
          title: 'Активных заданий нет',
          subtitle: isParent
            ? 'Создайте первое задание для ребёнка.'
            : 'Новые поручения от родителей появятся здесь.',
        }
      : filter === 'review'
        ? {
            title: 'Заданий на проверке нет',
            subtitle: 'Отправленные отчёты будут ждать подтверждения здесь.',
          }
        : {
            title: 'Завершённых заданий пока нет',
            subtitle: 'Выполненные задания появятся здесь.',
          };

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
            {isParent ? (
              <Button
                label="Новое задание"
                icon="add-task"
                size="lg"
                className="w-full rounded-xl"
                onPress={() => router.push('/new-task')}
              />
            ) : (
              <Button
                label="Попросить новое задание"
                icon="add-task"
                variant="secondary"
                size="lg"
                className="w-full rounded-xl"
                onPress={() => router.push('/request-task')}
              />
            )}

            <TaskFilterChips
              value={filter}
              activeCount={activeTasks.length}
              reviewCount={reviewTasks.length}
              onChange={setFilter}
            />

            <TaskEarningsCard
              title={isParent ? 'Выплачено за месяц' : 'Заработок за месяц'}
              earned={earnings}
              completed={progress.completed}
              total={progress.total}
              percent={progress.percent}
            />

            <View className="flex-row items-center justify-between gap-2 pt-1">
              <Text className="text-headline-sm font-inter-semibold text-on-surface">
                {isParent ? 'Задания семьи' : 'Текущие поручения'}
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
                  variant={isParent ? 'parent' : 'child'}
                  busy={busyId === task.id}
                  onSubmit={() => handleSubmit(task.id)}
                  onApprove={() => handleApprove(task)}
                  onReject={() => handleReject(task)}
                  onCancel={() => handleCancel(task)}
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

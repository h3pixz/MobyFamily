import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import type { NotificationDto } from '@/api/gen/models/NotificationDto';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/api/notifications';
import { FamilyHeader } from '@/components/family/family-header';
import { NotificationCard } from '@/components/notifications/notification-card';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchNotifications()
        .then((data) => {
          if (!cancelled) {
            setNotifications(data);
            setError(null);
          }
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
    }, []),
  );

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleOpen = async (notification: NotificationDto) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (markError) {
      Alert.alert('Не удалось отметить уведомление', getApiErrorMessage(markError));
    }
  };

  const handleMarkAll = async () => {
    if (markingAll || unreadCount === 0) {
      return;
    }

    setMarkingAll(true);

    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (markError) {
      Alert.alert('Не удалось прочитать все', getApiErrorMessage(markError));
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="Уведомления"
          onPressBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-0.5">
          <Text className="text-label-md font-inter-medium text-on-surface-variant">
            {unreadCount > 0 ? `Непрочитанных: ${unreadCount}` : 'Все уведомления прочитаны'}
          </Text>

          {unreadCount > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Прочитать все уведомления"
              disabled={markingAll}
              onPress={handleMarkAll}
              hitSlop={8}
              className="flex-row items-center gap-1">
              {markingAll ? (
                <ActivityIndicator size="small" color="#1D63ED" />
              ) : (
                <Icon name="done-all" size={18} color="#1D63ED" />
              )}
              <Text className="text-label-md font-inter-semibold text-primary">Прочитать все</Text>
            </Pressable>
          ) : null}
        </View>

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
        ) : notifications.length === 0 ? (
          <Card className="gap-1 p-margin">
            <Text className="text-center text-label-lg font-inter-semibold text-on-surface">
              Уведомлений пока нет
            </Text>
            <Text className="text-center text-body-sm font-inter text-on-surface-variant">
              Здесь появятся оповещения о покупках детей, запросах и заданиях.
            </Text>
          </Card>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={() => handleOpen(notification)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

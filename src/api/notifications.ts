import './client';

import {
  notificationsControllerGetNotifications,
  notificationsControllerGetUnreadCount,
  notificationsControllerMarkAllAsRead,
  notificationsControllerMarkAsRead,
} from './gen/clients';

export async function fetchNotifications() {
  return notificationsControllerGetNotifications({});
}

export async function fetchUnreadCount() {
  const response = await notificationsControllerGetUnreadCount({});

  return response.unreadCount;
}

export async function markNotificationRead(id: string) {
  return notificationsControllerMarkAsRead({ path: { id } });
}

export async function markAllNotificationsRead() {
  return notificationsControllerMarkAllAsRead({});
}

import { Pressable, Text, View } from 'react-native';

import type { NotificationDto } from '@/api/gen/models/NotificationDto';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import type { IconName } from '@/types/icons';
import { formatTransactionDate } from '@/utils/teen';

const ICONS: Record<NotificationDto['type'], IconName> = {
  RESTRICTED_18_PURCHASE: 'block',
  NIGHT_PURCHASE: 'nights-stay',
  LIMIT_EXCEEDED: 'speed',
  TRANSFER_REQUEST: 'swap-horiz',
  TASK_SUBMITTED: 'assignment-turned-in',
  PIGGY_BANK_TOPUP: 'savings',
};

type NotificationCardProps = {
  notification: NotificationDto;
  onPress: () => void;
};

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const unread = !notification.isRead;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={notification.title}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
      <Card
        className={`flex-row items-start gap-space-sm p-space-md ${
          unread ? 'border border-primary-fixed' : ''
        }`}>
        <IconTile
          icon={ICONS[notification.type] ?? 'notifications'}
          tone={unread ? 'primary' : 'neutral'}
        />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="min-w-0 flex-1 text-label-lg font-inter-semibold text-on-surface">
              {notification.title}
            </Text>
            <Text className="flex-shrink-0 text-[11px] font-inter text-outline">
              {formatTransactionDate(notification.createdAt)}
            </Text>
          </View>

          <Text className="mt-1 text-body-sm font-inter leading-snug text-on-surface-variant">
            {notification.message}
          </Text>

          {notification.child ? (
            <Text className="mt-1.5 text-label-sm font-inter-medium text-primary">
              {notification.child.name}
            </Text>
          ) : null}
        </View>

        {unread ? <View className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" /> : null}
      </Card>
    </Pressable>
  );
}

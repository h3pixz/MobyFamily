import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { pluralize } from '@/utils/format';

type FamilyAlertProps = {
  count: number;
  onPress: () => void;
};

export function FamilyAlert({ count, onPress }: FamilyAlertProps) {
  const requests = pluralize(count, ['запрос', 'запроса', 'запросов']);
  const verb = count === 1 ? 'ждёт' : 'ждут';
  const message =
    count > 0 ? `У Саши ${count} ${requests} ${verb} решения` : 'Все запросы Саши обработаны';

  return (
    <View className="flex-row items-center justify-between gap-2 rounded-card border border-warning-border bg-family-alert p-space-md">
      <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
        <View className="relative h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-fixed">
          <Icon name="notification-important" size={22} color="#FB7800" />
          {count > 0 ? (
            <View className="absolute right-1 top-1 h-2 w-2 rounded-full border border-surface-lowest bg-secondary-container" />
          ) : null}
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text className="text-label-md font-inter-bold text-on-surface">
              Семейные уведомления
            </Text>
            {count > 0 ? (
              <View className="rounded-full bg-secondary-fixed px-1.5 py-0.5">
                <Text className="text-label-xs font-inter-bold text-secondary">
                  {count} новых
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-0.5 text-label-sm font-inter-medium text-on-surface-variant">
            {message}
          </Text>
        </View>
      </View>

      <Button label="Посмотреть" variant="warning" size="sm" onPress={onPress} />
    </View>
  );
}

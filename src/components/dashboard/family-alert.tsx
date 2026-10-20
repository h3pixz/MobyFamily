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
  const verb = count === 1 ? 'требует' : 'требуют';
  const message =
    count > 0 ? `У Саши ${count} ${requests} ${verb} решения` : 'Все запросы Саши обработаны';

  return (
    <View className="flex-row items-center justify-between gap-2 rounded-card border border-secondary-fixed-dim bg-family-alert p-space-md">
      <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary-fixed">
          <Icon name="notification-important" size={22} color="#FB7800" />
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-label-sm font-inter-bold uppercase tracking-wider text-secondary">
              Семейные уведомления
            </Text>
            <View className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
          </View>
          <Text className="text-body-md font-inter-medium text-on-surface" numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
      <Button label="Посмотреть" variant="warning" size="sm" onPress={onPress} />
    </View>
  );
}

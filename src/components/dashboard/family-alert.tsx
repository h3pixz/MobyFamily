import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { pluralize } from '@/utils/format';

type FamilyAlertProps = {
  count: number;
  childName?: string;
  onPress: () => void;
};

export function FamilyAlert({ count, childName, onPress }: FamilyAlertProps) {
  const requests = pluralize(count, ['запрос', 'запроса', 'запросов']);
  const verb = count === 1 ? 'ждёт' : 'ждут';
  const message =
    count > 0
      ? `${childName ?? 'У ребёнка'}: ${count} ${requests} ${verb} решения`
      : 'Все запросы обработаны';

  return (
    <LinearGradient
      colors={['#FFF4EB', 'rgba(255,219,200,0.55)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, overflow: 'hidden' }}>
      <View
        className="flex-row items-center justify-between gap-2 border border-warning-border p-3.5"
        style={{ borderRadius: 16 }}>
        <View className="min-w-0 flex-1 flex-row items-center gap-3">
          <View className="relative h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-fixed/50">
            <Icon name="notification-important" size={20} color="#FB7800" />
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

        <Button
          label="Посмотреть"
          variant="warning"
          size="sm"
          onPress={onPress}
          labelNode={
            <View className="flex-row items-center gap-1">
              <Text className="text-label-md font-inter-semibold text-on-secondary">
                Посмотреть
              </Text>
              <Icon name="chevron-right" size={14} color="#FFFFFF" />
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}

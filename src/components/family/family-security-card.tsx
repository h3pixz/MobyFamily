import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export function FamilySecurityCard() {
  return (
    <View className="flex-row items-start gap-space-sm rounded-card bg-primary-fixed/40 p-space-md">
      <View className="mt-0.5 h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-fixed">
        <Icon name="verified-user" size={20} color="#004BC3" />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-label-lg font-inter-semibold text-primary-dark">
          Семейная безопасность
        </Text>
        <Text className="text-body-sm font-inter leading-relaxed text-on-surface-variant">
          Родители получают доступ к управлению лимитами, а дети получают карту Moby Junior и
          доступ к Фин-Академии.
        </Text>
      </View>
    </View>
  );
}

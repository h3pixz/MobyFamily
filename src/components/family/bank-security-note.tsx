import { Text, View } from 'react-native';

import { IconTile } from '@/components/ui/icon-tile';

export function BankSecurityNote() {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-surface-low p-4">
      <IconTile icon="security" tone="neutral" size="sm" className="rounded-xl" />
      <Text className="flex-1 text-body-sm font-inter leading-snug text-on-surface-variant">
        Данные шифруются и защищены в соответствии с требованиями банковской тайны{' '}
        <Text className="font-inter-medium text-on-surface">МТбанка</Text>.
      </Text>
    </View>
  );
}

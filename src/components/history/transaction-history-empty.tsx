import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

type TransactionHistoryEmptyProps = {
  title?: string;
  subtitle?: string;
};

export function TransactionHistoryEmpty({
  title = 'Операций пока нет',
  subtitle = 'По выбранному фильтру ничего не найдено.',
}: TransactionHistoryEmptyProps) {
  return (
    <Card className="items-center gap-2 px-6 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
        <Icon name="receipt-long" size={24} color="#1D63ED" />
      </View>
      <Text className="text-body-md font-inter-semibold text-on-surface">{title}</Text>
      <Text className="text-center text-body-sm font-inter text-on-surface-variant">
        {subtitle}
      </Text>
    </Card>
  );
}

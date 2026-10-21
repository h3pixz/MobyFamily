import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

export function TopUpHistoryEmpty() {
  return (
    <Card className="items-center gap-2 px-6 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
        <Icon name="savings" size={24} color="#1D63ED" />
      </View>
      <Text className="text-body-md font-inter-semibold text-on-surface">Пополнений пока нет</Text>
      <Text className="text-center text-body-sm font-inter text-on-surface-variant">
        Как только копилку пополнят, операции появятся здесь.
      </Text>
    </Card>
  );
}

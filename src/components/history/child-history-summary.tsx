import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { ChildProfile } from '@/types/dashboard';

type ChildHistorySummaryProps = {
  child: ChildProfile;
};

export function ChildHistorySummary({ child }: ChildHistorySummaryProps) {
  return (
    <Card className="flex-row items-center gap-3 p-3">
      <View className="h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary-fixed">
        <Text className="text-label-lg font-inter-bold text-primary">{child.initials}</Text>
        <View className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-lowest bg-accent" />
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row flex-wrap items-center gap-1.5">
          <Text
            numberOfLines={1}
            className="text-headline-sm font-inter-semibold leading-tight text-on-surface">
            {child.name}
          </Text>
          <View className="rounded-full bg-surface-container px-2 py-0.5">
            <Text className="text-label-sm font-inter-medium text-on-surface-variant">
              {child.age} лет
            </Text>
          </View>
        </View>

        <View className="mt-0.5 flex-row items-center gap-1">
          <Icon name="credit-card" size={14} color="#424655" />
          <Text className="text-body-sm font-inter text-on-surface-variant">
            Moby Junior •• {child.cardLast4}
          </Text>
        </View>
      </View>
    </Card>
  );
}

import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';

type FinanceAcademyCardProps = {
  onPress: () => void;
};

export function FinanceAcademyCard({ onPress }: FinanceAcademyCardProps) {
  return (
    <Card className="p-0">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Открыть урок «Нужно или хочется?»"
        onPress={onPress}
        className="rounded-card"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
        <View className="flex-row items-start justify-between gap-2 p-margin">
          <View className="min-w-0 flex-1 gap-1.5">
            <View className="flex-row flex-wrap items-center gap-1.5">
              <Badge label="Фин-академия" tone="secondary" icon="school" />
              <Badge label="+10 баллов" tone="tertiary" />
            </View>
            <Text className="text-headline-sm font-inter-bold leading-snug text-on-surface">
              Нужно или хочется?
            </Text>
            <View className="flex-row flex-wrap items-center gap-1.5">
              <View className="flex-row items-center gap-1">
                <Icon name="timer" size={14} color="#424655" />
                <Text className="text-body-sm font-inter text-on-surface-variant">3 мин</Text>
              </View>
              <Text className="text-body-sm font-inter text-on-surface-variant">•</Text>
              <Text className="text-body-sm font-inter text-on-surface-variant">
                Интерактивный квиз
              </Text>
            </View>
          </View>

          <View className="h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-surface-low">
            <Icon name="school" size={30} color="#1D63ED" />
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-2 rounded-b-card bg-surface-low px-margin py-2.5">
          <Text className="text-label-sm font-inter-semibold text-primary">
            Узнай, как копить быстрее
          </Text>
          <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-container">
            <Icon name="arrow-forward" size={16} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

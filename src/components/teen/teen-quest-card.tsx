import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import type { GraduationStatusResponseDto } from '@/api/gen/models/GraduationStatusResponseDto';
import { Icon } from '@/components/ui/icon';
import { pluralize } from '@/utils/format';
import { getQuestLevel } from '@/utils/teen';

type TeenQuestCardProps = {
  status: GraduationStatusResponseDto;
  monthsLeft: number;
  onPress: () => void;
};

export function TeenQuestCard({ status, monthsLeft, onPress }: TeenQuestCardProps) {
  const completed = status.checkpoints.filter((checkpoint) => checkpoint.isCompleted).length;
  const total = status.checkpoints.length;
  const progress = Math.min(100, Math.max(0, status.progressPercentage));

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{
        shadowColor: '#0F172A',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
      }}>
      <LinearGradient
        colors={['#2E3132', '#191C1E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}>
        <View className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-secondary-container/20" />

        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-row items-center gap-1 rounded-full border border-secondary-container/40 bg-secondary-container/20 px-2 py-0.5">
            <View className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
            <Text className="text-[10px] font-inter-bold text-secondary-fixed">
              До 18 лет: {monthsLeft} {pluralize(monthsLeft, ['месяц', 'месяца', 'месяцев'])}
            </Text>
          </View>
          <Text className="text-label-md font-inter-semibold text-white/70">
            Левел {getQuestLevel(completed)}
          </Text>
        </View>

        <Text className="mt-2 text-body-lg font-inter-bold tracking-tight text-white">
          Квест 17.5: Путь к 18 🚀
        </Text>
        <Text className="mt-1 text-[12px] font-inter leading-relaxed text-white/70">
          Подготовься к взрослой карте Moby и узнай её преимущества лично для тебя!
        </Text>

        <View className="mt-3">
          <View className="mb-1 flex-row items-center justify-between gap-2">
            <Text className="text-[11px] font-inter-medium text-white/70">
              Прогресс миссий: {progress}%
            </Text>
            <Text className="text-[11px] font-inter-semibold text-secondary-fixed">
              {completed} из {total}
            </Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <LinearGradient
              colors={['#1D63ED', '#FB7800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: '100%', width: `${progress}%`, borderRadius: 999 }}
            />
          </View>
        </View>

        <View className="mt-3 flex-row justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Открыть квесты"
            onPress={onPress}
            className="flex-row items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5"
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
            <Text className="text-label-md font-inter-semibold text-white">Квесты</Text>
            <Icon name="arrow-forward" size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

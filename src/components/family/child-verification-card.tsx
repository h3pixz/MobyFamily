import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';

const softShadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type ChildVerificationCardProps = {
  fileName: string | null;
  onPressPick: () => void;
};

export function ChildVerificationCard({ fileName, onPressPick }: ChildVerificationCardProps) {
  return (
    <Card className="gap-4 p-5">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-row items-center gap-2.5">
          <IconTile icon="badge" tone="secondary" size="sm" className="rounded-xl" />
          <View>
            <Text className="text-headline-sm font-inter-semibold text-on-surface">
              Верификация
            </Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">Шаг 2 из 2</Text>
          </View>
        </View>
        <Badge label="Закон РБ" tone="secondary" className="px-2.5 py-1" />
      </View>

      <Text className="text-body-sm font-inter leading-relaxed text-on-surface-variant">
        Загрузите скан или чёткое фото паспорта (страницы 31–33) или свидетельства о рождении
        для автоматической проверки личности и мгновенного открытия счёта.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={fileName ? 'Заменить документ' : 'Выбрать и загрузить документ'}
        onPress={onPressPick}
        className="items-center rounded-xl bg-surface-low px-5 py-5"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
        {fileName ? (
          <View className="items-center py-1">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-tertiary-fixed">
              <Icon name="check" size={24} color="#006242" />
            </View>
            <Text
              numberOfLines={1}
              className="mb-0.5 max-w-[240px] text-label-lg font-inter-semibold text-on-surface">
              {fileName}
            </Text>
            <Text className="text-label-sm font-inter-medium text-tertiary">
              Файл готов к отправке
            </Text>
            <Text className="mt-1 text-label-xs font-inter text-outline">
              Нажмите, чтобы заменить
            </Text>
          </View>
        ) : (
          <>
            <View
              className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-surface-lowest"
              style={softShadow}>
              <Icon name="image" size={28} color="#1D63ED" />
            </View>
            <View
              className="mb-2 rounded-xl bg-surface-lowest px-4 py-2"
              style={softShadow}>
              <Text className="text-label-lg font-inter-semibold text-primary-container">
                Выбрать и загрузить файл
              </Text>
            </View>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              JPG или PNG до 10 МБ
            </Text>
          </>
        )}
      </Pressable>
    </Card>
  );
}

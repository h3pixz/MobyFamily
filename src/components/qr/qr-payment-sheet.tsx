import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QrActionCard } from '@/components/qr/qr-action-card';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { QrPaymentSource } from '@/types/qr';
import { formatBYN } from '@/utils/format';

const sheetShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.18,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: -8 },
  elevation: 12,
};

type QrPaymentSheetProps = {
  source: QrPaymentSource;
  galleryLoading: boolean;
  onPressSource: () => void;
  onPressGallery: () => void;
};

export function QrPaymentSheet({
  source,
  galleryLoading,
  onPressSource,
  onPressGallery,
}: QrPaymentSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="mt-auto w-full gap-space-md rounded-t-[28px] bg-surface px-margin pt-4"
      style={[sheetShadow, { paddingBottom: insets.bottom + 24 }]}>
      <View className="mb-1 h-1 w-10 self-center rounded-full bg-surface-highest" />

      <Card className="gap-2 p-space-md">
        <Text className="text-label-sm font-inter-semibold uppercase tracking-wider text-on-surface-variant">
          Счёт списания
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Выбрать счёт списания"
          onPress={onPressSource}
          className="flex-row items-center justify-between gap-2 rounded-xl p-1"
          style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <LinearGradient
              colors={['#004BC3', '#1D63ED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 48,
                height: 32,
                borderRadius: 8,
                padding: 6,
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-[8px] font-inter-bold tracking-tight text-white/90">
                  MTBank
                </Text>
                <Icon name="contactless" size={10} color="#FFDBC8" />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-[7px] font-inter-medium tracking-wider text-white/90">
                  ••••
                </Text>
                <Text className="text-[7px] font-inter-medium tracking-wider text-white/90">
                  {source.last4}
                </Text>
              </View>
            </LinearGradient>

            <View className="min-w-0 flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text
                  numberOfLines={1}
                  className="shrink text-headline-sm font-inter-semibold text-on-surface">
                  {source.title}
                </Text>
                <View className="rounded-full bg-secondary-fixed px-1.5 py-0.5">
                  <BynIcon size={9} color="#321200" />
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-label-md font-inter text-on-surface-variant">
                  {formatBYN(source.balance)}
                </Text>
                <BynIcon size={9} color="#424655" />
                <Text className="text-label-md font-inter text-on-surface-variant">доступно</Text>
              </View>
            </View>
          </View>

          <View className="h-8 w-8 items-center justify-center rounded-full bg-surface-container">
            <Icon name="tune" size={18} color="#424655" />
          </View>
        </Pressable>
      </Card>

      <QrActionCard
        icon="photo-library"
        title="Из галереи"
        subtitle="Выбрать фото с QR"
        tone="primary"
        loading={galleryLoading}
        onPress={onPressGallery}
      />

      <View className="flex-row items-center justify-center gap-2 self-center rounded-full bg-surface-low px-3 py-2">
        <Icon name="verified-user" size={18} color="#004BC3" />
        <Text className="shrink text-center text-label-sm font-inter text-on-surface-variant">
          Безопасные платежи по стандарту НБРБ / ЕРИП
        </Text>
      </View>
    </View>
  );
}

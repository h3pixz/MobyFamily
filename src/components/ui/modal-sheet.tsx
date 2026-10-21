import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';

type ModalSheetProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export function ModalSheet({ title, subtitle, onClose, children }: ModalSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  return (
    <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(18, 22, 28, 0.4)' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Закрыть"
        onPress={onClose}
        className="absolute inset-0"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="w-full">
        <View
          className="w-full rounded-t-[28px] bg-surface-lowest"
          style={{
            maxHeight: windowHeight * 0.9,
            shadowColor: '#12161C',
            shadowOpacity: 0.12,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: -8 },
            elevation: 24,
          }}>
          <ScrollView
            className="w-full"
            style={{ flexGrow: 0, flexShrink: 1 }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="items-center py-1">
              <View className="h-1.5 w-10 rounded-full bg-surface-highest" />
            </View>

            <View className="mb-4 mt-3 flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text className="text-headline-md font-inter-semibold text-on-surface">{title}</Text>
                {subtitle ? (
                  <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Закрыть"
                onPress={onClose}
                hitSlop={8}
                className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container"
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
                <Icon name="close" size={18} color="#424655" />
              </Pressable>
            </View>

            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

import { Modal, Pressable, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';

type MyQrSheetProps = {
  visible: boolean;
  value: string;
  name: string;
  last4: string;
  onClose: () => void;
};

export function MyQrSheet({ visible, value, name, last4, onClose }: MyQrSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Закрыть"
        onPress={onClose}
        className="flex-1 justify-end bg-black/50">
        <Pressable
          onPress={() => {}}
          className="items-center gap-space-md rounded-t-[28px] bg-surface-lowest px-margin pt-3"
          style={{ paddingBottom: insets.bottom + 24 }}>
          <View className="mb-1 h-1 w-10 rounded-full bg-surface-highest" />

          <View className="items-center gap-1">
            <Text className="text-headline-md font-inter-semibold text-on-surface">
              Мой QR-код
            </Text>
            <Text className="text-center text-body-md font-inter text-on-surface-variant">
              Покажите код, чтобы получить перевод
            </Text>
          </View>

          <View className="items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-lowest p-4">
            <QRCode value={value} size={200} color="#191C1E" backgroundColor="#FFFFFF" />
            <Text className="text-label-md font-inter-semibold text-on-surface-variant">
              {name} · Moby junior •• {last4}
            </Text>
          </View>

          <Button label="Готово" size="lg" className="w-full" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

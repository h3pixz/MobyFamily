import { scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { MyQrSheet } from '@/components/qr/my-qr-sheet';
import { QrHeader } from '@/components/qr/qr-header';
import { QrPaymentSheet } from '@/components/qr/qr-payment-sheet';
import { QrViewfinder } from '@/components/qr/qr-viewfinder';
import { childProfile } from '@/data/dashboard';
import { myQrValue, qrPaymentSource } from '@/data/qr';

const FEEDBACK_DURATION = 1600;

export default function QrScannerScreen() {
  const isFocused = useIsFocused();
  const [torchOn, setTorchOn] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [myQrVisible, setMyQrVisible] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const showScanFeedback = useCallback(() => {
    setFeedbackVisible(true);
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => setFeedbackVisible(false), FEEDBACK_DURATION);
  }, []);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const pickFromGallery = async () => {
    setGalleryLoading(true);
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (picked.canceled) {
        return;
      }

      const codes = await scanFromURLAsync(picked.assets[0].uri, ['qr']);
      if (codes.length === 0) {
        Alert.alert('QR-код не найден', 'Выберите фото, на котором QR-код виден целиком.');
        return;
      }

      showScanFeedback();
    } catch {
      Alert.alert('Не удалось прочитать QR-код', 'Попробуйте выбрать другое фото.');
    } finally {
      setGalleryLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-inverse-surface">
      <StatusBar style="light" backgroundColor="#2E3132" />

      <QrHeader
        torchOn={torchOn}
        onToggleTorch={() => setTorchOn((current) => !current)}
        onPressBack={goBack}
        onPressProfile={() => router.push('/register')}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center px-margin pb-6 pt-2">
          <QrViewfinder
            torchOn={torchOn}
            active={isFocused}
            feedbackVisible={feedbackVisible}
            onBarcodeScanned={showScanFeedback}
            onDemoScan={showScanFeedback}
          />
        </View>

        <QrPaymentSheet
          source={qrPaymentSource}
          galleryLoading={galleryLoading}
          onPressSource={() => openSoon('Выбор счёта')}
          onPressGallery={pickFromGallery}
          onPressMyQr={() => setMyQrVisible(true)}
        />
      </ScrollView>

      <MyQrSheet
        visible={myQrVisible}
        value={myQrValue}
        name={childProfile.name}
        last4={childProfile.cardLast4}
        onClose={() => setMyQrVisible(false)}
      />
    </View>
  );
}

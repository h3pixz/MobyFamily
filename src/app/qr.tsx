import { scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import type { PayQrDto } from '@/api/gen/models/PayQrDto';
import { payByQr } from '@/api/payments';
import { useAuth } from '@/auth/auth-context';
import { CardPicker } from '@/components/money/card-picker';
import { QrHeader } from '@/components/qr/qr-header';
import { QrPaymentSheet } from '@/components/qr/qr-payment-sheet';
import { QrViewfinder } from '@/components/qr/qr-viewfinder';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { demoQrPayment, qrPaymentSource } from '@/data/qr';

const FEEDBACK_DURATION = 1600;

function parseQrPayment(raw: string): PayQrDto | null {
  try {
    const parsed = JSON.parse(raw) as PayQrDto;
    const hasItems = Array.isArray(parsed.items) && parsed.items.length > 0;
    const hasSingleItem = Boolean(parsed.mcc) && typeof parsed.amount === 'number';

    if (typeof parsed.merchant !== 'string' || !parsed.merchant) {
      return null;
    }

    return hasItems || hasSingleItem ? parsed : null;
  } catch {
    return null;
  }
}

export default function QrScannerScreen() {
  const isFocused = useIsFocused();
  const { profile } = useAuth();
  const [torchOn, setTorchOn] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [cards, setCards] = useState<CardDto[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentInFlight = useRef(false);
  const alertOpen = useRef(false);
  const scanCooldownUntil = useRef(0);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchFamily()
        .then((family) => {
          if (cancelled) {
            return;
          }

          setCards(family.user.cards);
          setSelectedCardId(
            (current) => current ?? family.user.cards[0]?.id ?? null,
          );
        })
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? null;
  const paymentCardId = selectedCard?.id ?? null;
  const paymentSource = selectedCard
    ? {
        title: isChildRole(profile?.role ?? '') ? 'Moby Junior' : 'Moby карта',
        last4: selectedCard.cardNumberMask.slice(-4),
        balance: selectedCard.balance,
      }
    : qrPaymentSource;

  const showScanFeedback = useCallback(() => {
    setFeedbackVisible(true);
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => setFeedbackVisible(false), FEEDBACK_DURATION);
  }, []);

  const showAlert = useCallback((title: string, message?: string) => {
    alertOpen.current = true;
    Alert.alert(
      title,
      message,
      [{ text: 'ОК', onPress: () => { alertOpen.current = false; } }],
      { cancelable: false },
    );
  }, []);

  const payWithPayload = useCallback(
    async (payload: PayQrDto) => {
      if (paymentInFlight.current) {
        return;
      }

      paymentInFlight.current = true;
      try {
        const result = await payByQr({
          ...payload,
          cardId: payload.cardId ?? paymentCardId ?? undefined,
        });
        showScanFeedback();

        if (result.status === 'SUCCESS') {
          showAlert('Оплата прошла', `Начислено ${result.earnedMobiks} Мобиков ⚡`);
        } else if (result.status === 'PENDING_PARENT_APPROVAL') {
          showAlert('Нужно подтверждение', result.message);
        } else {
          showAlert('Оплата', result.message);
        }
      } catch (error) {
        showAlert('Оплата не прошла', getApiErrorMessage(error));
      } finally {
        paymentInFlight.current = false;
        scanCooldownUntil.current = Date.now() + 3000;
      }
    },
    [paymentCardId, showAlert, showScanFeedback],
  );

  const handleScanned = useCallback(
    (raw: string) => {
      if (alertOpen.current || Date.now() < scanCooldownUntil.current) {
        return;
      }

      const payload = parseQrPayment(raw);

      if (!payload) {
        scanCooldownUntil.current = Date.now() + 3000;
        showAlert('Не удалось прочитать QR-код', 'В коде нет данных для оплаты.');
        return;
      }

      return payWithPayload(payload);
    },
    [payWithPayload, showAlert],
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
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

      await handleScanned(codes[0].data);
    } catch {
      Alert.alert('Не удалось прочитать QR-код', 'Попробуйте выбрать другое фото.');
    } finally {
      setGalleryLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-inverse-surface">
      <StatusBar style="light" />

      <QrHeader
        torchOn={torchOn}
        onToggleTorch={() => setTorchOn((current) => !current)}
        onPressBack={goBack}
        onPressProfile={() => router.push('/profile')}
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
            onBarcodeScanned={handleScanned}
            onDemoScan={() => handleScanned(JSON.stringify(demoQrPayment))}
          />
        </View>

        <QrPaymentSheet
          source={paymentSource}
          galleryLoading={galleryLoading}
          onPressSource={() => setPickerOpen(true)}
          onPressGallery={pickFromGallery}
        />
      </ScrollView>

      <Modal
        transparent
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}>
        <ModalSheet title="Выбор счёта" subtitle="Списание при оплате" onClose={() => setPickerOpen(false)}>
          <CardPicker
            cards={cards}
            value={selectedCardId}
            onChange={(cardId) => {
              setSelectedCardId(cardId);
              setPickerOpen(false);
            }}
            label="Карта для оплаты"
          />
        </ModalSheet>
      </Modal>
    </View>
  );
}

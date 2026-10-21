import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { fetchPiggyBank, withdrawPiggyBank } from '@/api/piggy-banks';
import { useAuth } from '@/auth/auth-context';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { formatBYN } from '@/utils/format';

export default function PiggyBankWithdrawScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');

  const [piggyBank, setPiggyBank] = useState<PiggyBankResponseDto | null>(null);
  const [cards, setCards] = useState<CardDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [breakPiggyBank, setBreakPiggyBank] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoadError('Копилка не найдена');
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.allSettled([fetchPiggyBank(id), fetchFamily()]).then(
      ([piggyBankResult, familyResult]) => {
        if (cancelled) {
          return;
        }

        if (piggyBankResult.status === 'fulfilled') {
          setPiggyBank(piggyBankResult.value);
        } else {
          setLoadError(getApiErrorMessage(piggyBankResult.reason));
        }

        if (familyResult.status === 'fulfilled') {
          setCards(familyResult.value.user.cards);
          setCardId(familyResult.value.user.cards[0]?.id ?? null);
        }

        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/piggy-banks');
  };

  const amount = piggyBank?.currentAmount ?? 0;
  const canSubmit = isChild && Boolean(id) && Boolean(piggyBank) && amount > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !id) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await withdrawPiggyBank({
        id,
        cardId: cardId ?? undefined,
        breakPiggyBank,
      });

      Alert.alert('Средства зачислены', response.message, [{ text: 'ОК', onPress: close }]);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!isChild) {
    return (
      <ModalSheet title="Забрать из копилки" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Забрать накопления может только владелец копилки.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title="Забрать из копилки"
      subtitle={piggyBank?.title}
      onClose={close}>
      {loading ? (
        <View className="items-center py-10">
          <ActivityIndicator size="small" color="#1D63ED" />
        </View>
      ) : loadError || !piggyBank ? (
        <View className="items-center gap-2 py-10">
          <Icon name="error-outline" size={28} color="#BA1A1A" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            {loadError ?? 'Копилка не найдена'}
          </Text>
        </View>
      ) : (
        <View className="gap-3.5">
          <View className="items-center gap-1 rounded-xl bg-surface-low px-4 py-5">
            <Text className="text-label-md font-inter-medium text-on-surface-variant">
              К зачислению на карту
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-headline-lg font-inter-bold text-on-surface">
                {formatBYN(amount)}
              </Text>
              <BynIcon size={14} color="#1D63ED" />
            </View>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              {piggyBank.isGoalReached
                ? 'Цель достигнута — копилка будет завершена'
                : 'Копилка будет отмечена как разбитая'}
            </Text>
          </View>

          <CardPicker
            cards={cards}
            value={cardId}
            onChange={setCardId}
            label="Зачислить на карту"
          />

          {!piggyBank.isGoalReached ? (
            <Checkbox
              checked={breakPiggyBank}
              onChange={setBreakPiggyBank}
              accessibilityLabel="Разбить копилку досрочно"
              labelNode={
                <Text className="flex-1 text-body-sm font-inter text-on-surface-variant">
                  Разбить копилку досрочно и забрать всё сейчас
                </Text>
              }
            />
          ) : null}

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label="Забрать на карту"
            icon="savings"
            size="lg"
            className="h-[52px] w-full rounded-xl"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
          />
        </View>
      )}
    </ModalSheet>
  );
}

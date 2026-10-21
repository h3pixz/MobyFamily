import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import { createTransferRequest } from '@/api/payments';
import { useAuth } from '@/auth/auth-context';
import { isChildRole } from '@/api/auth';
import { AmountField } from '@/components/money/amount-field';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { parseAmountInput } from '@/utils/piggy-bank';

const MIN_AMOUNT = 0.01;

export default function TransferRequestScreen() {
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');
  const [cards, setCards] = useState<CardDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [amount, setAmount] = useState('10,00');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(isChild);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChild) {
      return;
    }

    let cancelled = false;

    fetchFamily()
      .then((family) => {
        if (cancelled) {
          return;
        }

        setCards(family.user.cards);
        setCardId(family.user.cards[0]?.id ?? null);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isChild]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const parsedAmount = parseAmountInput(amount);
  const trimmedComment = comment.trim();
  const amountError =
    parsedAmount < MIN_AMOUNT ? 'Введите сумму от 0,01 BYN' : null;
  const commentError = trimmedComment.length === 0 ? 'Опишите, зачем нужны деньги' : null;
  const canSubmit = isChild && Boolean(cardId) && !amountError && !commentError && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !cardId) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createTransferRequest({
        amount: parsedAmount,
        cardId,
        comment: trimmedComment,
      });

      Alert.alert('Запрос отправлен', response.message, [{ text: 'ОК', onPress: close }]);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!isChild) {
    return (
      <ModalSheet title="Запрос денег" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Запрашивать деньги могут только дети и подростки.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title="Попросить деньги"
      subtitle="Запрос увидят все привязанные родители"
      onClose={close}>
      {loading ? (
        <View className="items-center py-10">
          <ActivityIndicator size="small" color="#1D63ED" />
        </View>
      ) : loadError ? (
        <View className="items-center gap-2 py-10">
          <Icon name="error-outline" size={28} color="#BA1A1A" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            {loadError}
          </Text>
        </View>
      ) : (
        <View className="gap-3.5">
          <AmountField value={amount} onChange={setAmount} error={amountError} />
          <Field
            label="Комментарий"
            placeholder="На обед в столовой"
            value={comment}
            onChangeText={(value) => {
              setComment(value);
              setSubmitError(null);
            }}
            error={commentError ?? undefined}
            maxLength={500}
            multiline
          />
          <CardPicker
            cards={cards}
            value={cardId}
            onChange={setCardId}
            label="Зачислить на карту"
          />

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label="Отправить запрос"
            icon="send"
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

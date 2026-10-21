import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import type { ChildUserWithCardsDto } from '@/api/gen/models/ChildUserWithCardsDto';
import { transferByPhone, transferToChild } from '@/api/payments';
import { useAuth } from '@/auth/auth-context';
import { AmountField } from '@/components/money/amount-field';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { getFirstName } from '@/utils/greeting';
import { formatPhone, isPhoneComplete, toPhoneNumber } from '@/utils/phone';
import { parseAmountInput } from '@/utils/piggy-bank';

type TransferMode = 'phone' | 'child';

export default function TransferScreen() {
  const params = useLocalSearchParams<{ mode?: string; childId?: string }>();
  const mode: TransferMode = params.mode === 'child' ? 'child' : 'phone';
  const { profile } = useAuth();
  const isYoungChild = profile?.role.startsWith('CHILD') ?? false;

  const [cards, setCards] = useState<CardDto[]>([]);
  const [children, setChildren] = useState<ChildUserWithCardsDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(params.childId ?? null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('10,00');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchFamily()
      .then((family) => {
        if (cancelled) {
          return;
        }

        setCards(family.user.cards);
        setChildren(family.children);
        setCardId(family.user.cards[0]?.id ?? null);
        setChildId((current) => current ?? family.children[0]?.id ?? null);
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
  }, []);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const parsedAmount = parseAmountInput(amount);
  const selectedCard = cards.find((card) => card.id === cardId) ?? null;
  const selectedChild = children.find((child) => child.id === childId) ?? null;

  const amountError =
    parsedAmount < 0.01
      ? 'Введите сумму от 0,01 BYN'
      : selectedCard && parsedAmount > selectedCard.balance
        ? 'Недостаточно средств на карте'
        : null;
  const phoneError =
    mode === 'phone' && phone.length > 0 && !isPhoneComplete(phone)
      ? 'Введите номер полностью'
      : null;
  const canSubmit =
    !isYoungChild &&
    Boolean(cardId) &&
    !amountError &&
    (mode === 'phone'
      ? isPhoneComplete(phone)
      : Boolean(selectedChild)) &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !cardId) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response =
        mode === 'phone'
          ? await transferByPhone({
              recipientPhone: toPhoneNumber(phone),
              amount: parsedAmount,
              comment: comment.trim() || undefined,
              cardId,
            })
          : await transferToChild({
              childId: childId as string,
              amount: parsedAmount,
              comment: comment.trim() || undefined,
              parentCardId: cardId,
            });

      Alert.alert('Перевод выполнен', response.message, [{ text: 'ОК', onPress: close }]);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (isYoungChild) {
    return (
      <ModalSheet title="Перевод" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Переводы по номеру доступны подросткам с 14 лет. Попросите деньги у родителей.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title={mode === 'phone' ? 'Перевести по номеру' : 'Перевести ребёнку'}
      subtitle={
        mode === 'phone'
          ? 'Другу или родственнику через Moby'
          : selectedChild
            ? `${getFirstName(selectedChild.name)} получит деньги сразу`
            : undefined
      }
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
          {mode === 'phone' ? (
            <Field
              label="Номер получателя"
              placeholder="(29) 000-00-00"
              keyboardType="phone-pad"
              maxLength={15}
              value={phone}
              onChangeText={(value) => {
                setPhone(formatPhone(value));
                setSubmitError(null);
              }}
              error={phoneError ?? undefined}
              prefix={
                <View className="flex-row items-center">
                  <Text className="text-[16px] leading-none">🇧🇾</Text>
                  <Text className="ml-1.5 text-label-md font-inter-semibold text-on-surface">+375</Text>
                  <View className="mx-2 h-4 w-px bg-surface-highest" />
                </View>
              }
            />
          ) : (
            <View className="gap-2">
              <Text className="text-label-md font-inter-semibold text-on-surface-variant">
                Кому перевести
              </Text>
              {children.length === 0 ? (
                <Text className="text-body-sm font-inter text-on-surface-variant">
                  В семье пока нет детей.
                </Text>
              ) : (
                children.map((child) => {
                  const selected = child.id === childId;
                  const childCard = child.cards[0];

                  return (
                    <Pressable
                      key={child.id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        setChildId(child.id);
                        setSubmitError(null);
                      }}
                      className={`flex-row items-center gap-3 rounded-xl border-2 px-3 py-3 ${
                        selected
                          ? 'border-primary-container bg-surface-lowest'
                          : 'border-transparent bg-surface-low'
                      }`}
                      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-fixed">
                        <Text className="text-label-md font-inter-bold text-primary">👦🏻</Text>
                      </View>
                      <View className="min-w-0 flex-1">
                        <Text className="text-label-md font-inter-semibold text-on-surface">
                          {getFirstName(child.name)}
                        </Text>
                        <Text className="text-label-sm font-inter text-on-surface-variant">
                          {childCard ? `Карта •• ${childCard.cardNumberMask.slice(-4)}` : 'Без карты'}
                        </Text>
                      </View>
                      <Icon
                        name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={20}
                        color={selected ? '#1D63ED' : '#737686'}
                      />
                    </Pressable>
                  );
                })
              )}
            </View>
          )}

          <AmountField value={amount} onChange={setAmount} error={amountError} />
          <CardPicker
            cards={cards}
            value={cardId}
            onChange={setCardId}
            label="Списать с карты"
          />
          <Field
            label="Комментарий"
            placeholder="На карманные расходы"
            value={comment}
            onChangeText={(value) => {
              setComment(value);
              setSubmitError(null);
            }}
            maxLength={500}
          />

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label="Перевести"
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

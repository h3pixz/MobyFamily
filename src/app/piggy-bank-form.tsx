import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import { createPiggyBank, fetchPiggyBank, updatePiggyBank } from '@/api/piggy-banks';
import { useAuth } from '@/auth/auth-context';
import { AmountField } from '@/components/money/amount-field';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { formatDateInput, toIsoDate } from '@/utils/date-input';
import { formatAmountInput, parseAmountInput } from '@/utils/piggy-bank';

export default function PiggyBankFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');
  const editing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [cards, setCards] = useState<CardDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isChild);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isChild) {
      return;
    }

    let cancelled = false;

    Promise.allSettled([fetchFamily(), id ? fetchPiggyBank(id) : Promise.resolve(null)]).then(
      ([familyResult, piggyBankResult]) => {
        if (cancelled) {
          return;
        }

        if (familyResult.status === 'fulfilled') {
          setCards(familyResult.value.user.cards);
          setCardId(familyResult.value.user.cards[0]?.id ?? null);
        } else {
          setLoadError(getApiErrorMessage(familyResult.reason));
        }

        if (id && piggyBankResult.status === 'fulfilled' && piggyBankResult.value) {
          const piggyBank = piggyBankResult.value;

          setTitle(piggyBank.title);
          setDescription(
            typeof piggyBank.description === 'string' ? piggyBank.description : '',
          );
          setTargetAmount(formatAmountInput(piggyBank.targetAmount));
        } else if (id && piggyBankResult.status === 'rejected') {
          setLoadError(getApiErrorMessage(piggyBankResult.reason));
        }

        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [id, isChild]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/piggy-banks');
  };

  const parsedTarget = parseAmountInput(targetAmount);
  const parsedInitial = initialAmount ? parseAmountInput(initialAmount) : 0;
  const selectedCard = cards.find((card) => card.id === cardId) ?? null;
  const titleError = title.trim().length === 0 ? 'Укажите название цели' : null;
  const targetError = parsedTarget < 1 ? 'Цель — от 1 BYN' : null;
  const initialError =
    !editing && parsedInitial > 0 && selectedCard && parsedInitial > selectedCard.balance
      ? 'Недостаточно средств на карте'
      : null;
  const dateIso = targetDate ? toIsoDate(targetDate) : null;
  const dateError =
    !editing && targetDate.length > 0 && !dateIso
      ? 'Укажите дату в формате ДД.ММ.ГГГГ'
      : null;
  const canSubmit =
    isChild &&
    !titleError &&
    !targetError &&
    !initialError &&
    !dateError &&
    (!editing || Boolean(id)) &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response =
        editing && id
          ? await updatePiggyBank(id, {
              title: title.trim(),
              description: description.trim() || undefined,
              targetAmount: parsedTarget,
            })
          : await createPiggyBank({
              title: title.trim(),
              description: description.trim() || undefined,
              targetAmount: parsedTarget,
              targetDate: dateIso ?? undefined,
              initialAmount: parsedInitial > 0 ? parsedInitial : undefined,
              cardId: parsedInitial > 0 ? cardId ?? undefined : undefined,
            });

      Alert.alert(
        editing ? 'Копилка обновлена' : 'Копилка создана',
        'message' in response ? response.message : undefined,
        [{ text: 'ОК', onPress: close }],
      );
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!isChild) {
    return (
      <ModalSheet title="Копилка" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Создавать и редактировать копилки могут только дети и подростки.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title={editing ? 'Изменить копилку' : 'Новая копилка'}
      subtitle={editing ? 'Обновите цель и описание' : 'Накопите на мечту вместе с семьёй'}
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
          <Field
            label="Название цели"
            placeholder="PlayStation 5"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              setSubmitError(null);
            }}
            error={titleError ?? undefined}
            maxLength={80}
          />
          <Field
            label="Описание"
            placeholder="Коплю на приставку к Новому году"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
          />
          <AmountField
            value={targetAmount}
            onChange={setTargetAmount}
            label="Целевая сумма"
            error={targetError}
          />

          {!editing ? (
            <>
              <Field
                label="Дата цели"
                placeholder="ДД.ММ.ГГГГ (необязательно)"
                keyboardType="number-pad"
                maxLength={10}
                value={targetDate}
                onChangeText={(value) => {
                  setTargetDate(formatDateInput(value));
                  setSubmitError(null);
                }}
                error={dateError ?? undefined}
              />
              <AmountField
                value={initialAmount}
                onChange={setInitialAmount}
                label="Стартовый взнос"
                hint="Необязательно"
                error={initialError}
              />
              <CardPicker
                cards={cards}
                value={cardId}
                onChange={setCardId}
                label="Списать стартовый взнос с карты"
              />
            </>
          ) : null}

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label={editing ? 'Сохранить изменения' : 'Создать копилку'}
            icon={editing ? 'save' : 'add'}
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

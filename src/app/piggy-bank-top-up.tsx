import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isChildRole } from '@/api/auth';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { getApiErrorMessage } from '@/api/error';
import { fetchPiggyBank, topUpPiggyBank } from '@/api/piggy-banks';
import { useAuth } from '@/auth/auth-context';
import { PiggyBankAmountCard } from '@/components/piggy-bank/piggy-bank-amount-card';
import { PiggyBankSourceCard } from '@/components/piggy-bank/piggy-bank-source-card';
import { PiggyBankSummaryCard } from '@/components/piggy-bank/piggy-bank-summary-card';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';
import { getWeeklyContributions, parseAmountInput } from '@/utils/piggy-bank';

const MIN_AMOUNT = 0.1;

export default function PiggyBankTopUpScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isChild = isChildRole(profile?.role ?? '');
  const [piggyBank, setPiggyBank] = useState<PiggyBankResponseDto | null>(null);
  const [card, setCard] = useState<CardDto | null>(null);
  const [amount, setAmount] = useState('10,00');
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    id ? null : 'Копилка не найдена',
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
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
          setLoadError('Не удалось загрузить копилку');
        }

        if (familyResult.status === 'fulfilled') {
          setCard(familyResult.value.user.cards[0] ?? null);
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
    router.replace(isChild ? '/child' : '/');
  };

  const parsedAmount = parseAmountInput(amount);
  const balance = card?.balance ?? 0;
  const amountError = !card
    ? 'Нет карты для пополнения'
    : parsedAmount < MIN_AMOUNT
      ? 'Введите сумму от 0,10 BYN'
      : parsedAmount > balance
        ? 'Недостаточно средств на карте'
        : null;
  const canSubmit = Boolean(piggyBank && card) && !amountError && !submitting;
  const weeklyDelta = piggyBank ? getWeeklyContributions(piggyBank.contributions) : 0;
  const cardTitle = card
    ? isChild
      ? `Moby Junior •• ${card.cardNumberMask.slice(-4)}`
      : `Moby карта •• ${card.cardNumberMask.slice(-4)}`
    : 'Карта не найдена';

  const handleSubmit = async () => {
    if (!piggyBank || !card || !canSubmit) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await topUpPiggyBank({ id: piggyBank.id, amount: parsedAmount, cardId: card.id });
      close();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(18, 22, 28, 0.4)' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Закрыть"
        onPress={close}
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
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-headline-md font-inter-semibold text-on-surface">
                    Пополнить копилку
                  </Text>
                  <Text className="text-xl leading-none">🐷</Text>
                </View>
                <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
                  Перевод средств на целевую копилку
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Закрыть"
                onPress={close}
                hitSlop={8}
                className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container"
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
                <Icon name="close" size={18} color="#424655" />
              </Pressable>
            </View>

            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="small" color="#1D63ED" />
              </View>
            ) : !piggyBank ? (
              <View className="items-center gap-2 py-10">
                <Icon name="error-outline" size={28} color="#BA1A1A" />
                <Text className="text-body-md font-inter text-on-surface-variant">
                  {loadError ?? 'Копилка не найдена'}
                </Text>
              </View>
            ) : (
              <>
                <PiggyBankSummaryCard piggyBank={piggyBank} weeklyDelta={weeklyDelta} />
                <PiggyBankSourceCard title={cardTitle} balance={balance} />
                <PiggyBankAmountCard
                  amount={amount}
                  remainingAmount={piggyBank.remainingAmount}
                  onChangeAmount={(value) => {
                    setAmount(value);
                    setSubmitError(null);
                  }}
                />

                {amountError ? (
                  <View className="mb-3 flex-row items-center gap-1.5">
                    <Icon name="error-outline" size={14} color="#BA1A1A" />
                    <Text className="flex-1 text-label-sm font-inter text-error">{amountError}</Text>
                  </View>
                ) : null}

                <Button
                  label="Пополнить копилку"
                  size="lg"
                  className="h-[52px] w-full rounded-xl"
                  loading={submitting}
                  disabled={!canSubmit}
                  onPress={handleSubmit}
                  labelNode={
                    <View className="flex-row items-center gap-2">
                      <Text className="text-label-lg font-inter-semibold text-on-primary">
                        Пополнить на {formatBYN(parsedAmount)}
                      </Text>
                      <BynIcon size={10} color="#FFFFFF" />
                      <Text className="text-lg">🚀</Text>
                    </View>
                  }
                />

                {submitError ? (
                  <View className="mt-3 flex-row items-center gap-1.5">
                    <Icon name="error-outline" size={14} color="#BA1A1A" />
                    <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

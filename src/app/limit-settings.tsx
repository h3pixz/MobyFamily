import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { fetchFamily, resetSpentToday, updateCardLimits } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import { CardControlsCard } from '@/components/limits/card-controls-card';
import { DailyLimitCard } from '@/components/limits/daily-limit-card';
import { PocketMoneyCard } from '@/components/limits/pocket-money-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';
import { clampDailyLimit } from '@/utils/limits';
import { getFirstName } from '@/utils/greeting';
import { formatAmountInput, parseAmountInput } from '@/utils/piggy-bank';

export default function LimitSettingsScreen() {
  const { cardId } = useLocalSearchParams<{ cardId?: string }>();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [card, setCard] = useState<CardDto | null>(null);
  const [childName, setChildName] = useState('');
  const [dailyLimit, setDailyLimit] = useState(15);
  const [pocketMoneyAmount, setPocketMoneyAmount] = useState('25,00');
  const [pocketMoneyDay, setPocketMoneyDay] = useState(1);
  const [allowOnlinePurchases, setAllowOnlinePurchases] = useState(true);
  const [allowCashWithdrawal, setAllowCashWithdrawal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(Boolean(cardId));
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    cardId ? null : 'Карта не найдена',
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      return;
    }

    let cancelled = false;

    fetchFamily()
      .then((family) => {
        if (cancelled) {
          return;
        }

        const foundCard = [...family.user.cards, ...family.children.flatMap((child) => child.cards)].find(
          (item) => item.id === cardId,
        );
        const child = family.children.find((item) =>
          item.cards.some((itemCard) => itemCard.id === cardId),
        );

        if (!foundCard) {
          setLoadError('Карта не найдена');
        } else {
          setCard(foundCard);
          setChildName(getFirstName(child?.name ?? ''));
          setDailyLimit(clampDailyLimit(foundCard.dailyLimit));
          setPocketMoneyAmount(
            formatAmountInput(Number.isFinite(foundCard.pocketMoneyAmount) ? foundCard.pocketMoneyAmount : 0),
          );
          setPocketMoneyDay(Number.isFinite(foundCard.pocketMoneyDay) ? foundCard.pocketMoneyDay : 1);
          setAllowOnlinePurchases(foundCard.allowOnlinePurchases ?? true);
          setAllowCashWithdrawal(foundCard.allowCashWithdrawal ?? false);
          setIsBlocked(foundCard.isBlocked ?? false);
        }

        setLoading(false);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(error));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cardId]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const handleSave = async () => {
    if (!card || submitting || saved) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await updateCardLimits({
        cardId: card.id,
        dailyLimit,
        pocketMoneyAmount: parseAmountInput(pocketMoneyAmount),
        pocketMoneyDay,
        allowOnlinePurchases,
        allowCashWithdrawal,
        isBlocked,
      });
      setSubmitting(false);
      setSaved(true);
      setTimeout(close, 700);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleResetSpent = () => {
    if (!card || resetting) {
      return;
    }

    Alert.alert(
      'Сбросить траты?',
      `Доступный остаток снова станет ${formatBYN(dailyLimit)}.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          onPress: async () => {
            setResetting(true);

            try {
              const response = await resetSpentToday(card.id);

              setCard((current) =>
                current
                  ? {
                      ...current,
                      dailyLimit: response.card.dailyLimit,
                      spentToday: response.card.spentToday,
                      remainingDailyLimit: response.card.remainingDailyLimit,
                    }
                  : current,
              );
              setDailyLimit(clampDailyLimit(response.card.dailyLimit));
              Alert.alert('Готово', response.message);
            } catch (resetError) {
              Alert.alert('Не удалось сбросить', getApiErrorMessage(resetError));
            } finally {
              setResetting(false);
            }
          },
        },
      ],
    );
  };

  const handleBlockedChange = (value: boolean) => {
    if (!value) {
      setIsBlocked(false);
      return;
    }

    Alert.alert(
      'Заблокировать карту?',
      'Все операции по карте будут отклонены до разблокировки.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Заблокировать',
          style: 'destructive',
          onPress: () => setIsBlocked(true),
        },
      ],
    );
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
                <Text className="text-headline-md font-inter-semibold text-on-surface">
                  Настройка лимитов
                </Text>
                <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
                  {childName ? `${childName} · ` : ''}Дневной лимит и регулярные выплаты
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
            ) : !card ? (
              <View className="items-center gap-2 py-10">
                <Icon name="error-outline" size={28} color="#BA1A1A" />
                <Text className="text-body-md font-inter text-on-surface-variant">
                  {loadError ?? 'Карта не найдена'}
                </Text>
              </View>
            ) : (
              <>
                <View className="gap-3.5">
                  <DailyLimitCard value={dailyLimit} onChange={setDailyLimit} />
                  <PocketMoneyCard
                    amount={pocketMoneyAmount}
                    day={pocketMoneyDay}
                    onChangeAmount={(value) => {
                      setPocketMoneyAmount(value);
                      setSubmitError(null);
                    }}
                    onChangeDay={setPocketMoneyDay}
                  />
                  <CardControlsCard
                    allowOnlinePurchases={allowOnlinePurchases}
                    allowCashWithdrawal={allowCashWithdrawal}
                    isBlocked={isBlocked}
                    spentToday={card.spentToday}
                    dailyLimit={dailyLimit}
                    resetting={resetting}
                    onChangeOnline={setAllowOnlinePurchases}
                    onChangeCash={setAllowCashWithdrawal}
                    onChangeBlocked={handleBlockedChange}
                    onResetSpent={handleResetSpent}
                  />
                </View>

                {submitError ? (
                  <View className="mt-3 flex-row items-center gap-1.5">
                    <Icon name="error-outline" size={14} color="#BA1A1A" />
                    <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
                  </View>
                ) : null}

                <View className="pb-1 pt-2">
                  <Button
                    label={saved ? 'Настройки обновлены!' : 'Сохранить настройки'}
                    icon={saved ? 'done-all' : 'check-circle'}
                    variant={saved ? 'warning' : 'primary'}
                    size="lg"
                    className="h-[52px] w-full rounded-xl"
                    loading={submitting}
                    disabled={saved}
                    onPress={handleSave}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

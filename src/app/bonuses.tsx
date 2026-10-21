import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import type { CashbackCategoriesResponseDto } from '@/api/gen/models/CashbackCategoriesResponseDto';
import type { LoyaltyOffersResponseDto } from '@/api/gen/models/LoyaltyOffersResponseDto';
import {
  fetchCashbackCategories,
  fetchLoyaltyOffers,
  redeemOffer,
  selectCashbackCategories,
} from '@/api/loyalty';
import { BankCard } from '@/components/dashboard/bank-card';
import { FamilyHeader } from '@/components/family/family-header';
import { OfferCard } from '@/components/loyalty/offer-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { formatPoints } from '@/utils/format';
import { formatTransactionDate } from '@/utils/teen';

export default function BonusesScreen() {
  const insets = useSafeAreaInsets();
  const [offers, setOffers] = useState<LoyaltyOffersResponseDto | null>(null);
  const [cashback, setCashback] = useState<CashbackCategoriesResponseDto | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [savingCashback, setSavingCashback] = useState(false);
  const [cashbackMessage, setCashbackMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      Promise.allSettled([fetchLoyaltyOffers(), fetchCashbackCategories()]).then(
        ([offersResult, cashbackResult]) => {
          if (cancelled) {
            return;
          }

          if (offersResult.status === 'fulfilled') {
            setOffers(offersResult.value);
            setError(null);
          } else {
            setError(getApiErrorMessage(offersResult.reason));
          }

          if (cashbackResult.status === 'fulfilled') {
            setCashback(cashbackResult.value);
            setSelectedCategories(cashbackResult.value.selectedCategories);
            setSavedCategories(cashbackResult.value.selectedCategories);
          }

          setLoading(false);
        },
      );

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleRedeem = (offerId: string) => {
    const offer = offers?.offers.find((item) => item.id === offerId);

    if (!offer) {
      return;
    }

    Alert.alert(
      'Обменять Мобики?',
      `«${offer.title}» за ${formatPoints(offer.cost)} Мобиков.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Обменять',
          onPress: async () => {
            setRedeemingId(offer.id);

            try {
              const response = await redeemOffer(offer.id);

              setOffers((current) =>
                current
                  ? {
                      ...current,
                      mobiksBalance: response.mobiksBalance,
                      purchasedRewards: [response.purchasedReward, ...current.purchasedRewards],
                    }
                  : current,
              );

              Alert.alert(
                'Промокод готов',
                `${response.purchasedReward.title}\n\n${response.purchasedReward.promoCode}`,
              );
            } catch (redeemError) {
              Alert.alert('Не удалось обменять', getApiErrorMessage(redeemError));
            } finally {
              setRedeemingId(null);
            }
          },
        },
      ],
    );
  };

  const toggleCategory = (code: string) => {
    setCashbackMessage(null);

    setSelectedCategories((current) => {
      if (current.includes(code)) {
        return current.filter((item) => item !== code);
      }
      if (current.length >= 2) {
        Alert.alert('Максимум 2 категории', 'Снимите выбор с другой категории.');
        return current;
      }

      return [...current, code];
    });
  };

  const handleSaveCashback = async () => {
    if (savingCashback || selectedCategories.length === 0) {
      return;
    }

    setSavingCashback(true);
    setCashbackMessage(null);

    try {
      const response = await selectCashbackCategories(selectedCategories);

      setSelectedCategories(response.selectedCategories);
      setSavedCategories(response.selectedCategories);
      setCashbackMessage(response.message);
    } catch (saveError) {
      Alert.alert('Не удалось сохранить категории', getApiErrorMessage(saveError));
    } finally {
      setSavingCashback(false);
    }
  };

  const cashbackChanged =
    [...selectedCategories].sort().join(',') !== [...savedCategories].sort().join(',');

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="Moby Бонусы"
          onPressBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="small" color="#1D63ED" />
          </View>
        ) : error ? (
          <View className="items-center gap-2 py-16">
            <Icon name="error-outline" size={28} color="#BA1A1A" />
            <Text className="text-center text-body-md font-inter text-on-surface-variant">
              {error}
            </Text>
          </View>
        ) : (
          <>
            <BankCard colors={['#FB7800', '#E56A00']} padding={16}>
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                  <Icon name="star" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="text-label-md font-inter-semibold uppercase tracking-wider text-white/80">
                    Баланс Мобиков
                  </Text>
                  <Text className="text-headline-lg font-inter-bold text-white">
                    {formatPoints(offers?.mobiksBalance ?? 0)}
                  </Text>
                </View>
              </View>
              <Text className="mt-3 text-label-sm font-inter text-white/80">
                Мобики начисляются за покупки и задания. Обменивайте их на награды партнёров.
              </Text>
            </BankCard>

            {cashback ? (
              <Card className="gap-3 p-4">
                <View>
                  <Text className="text-headline-sm font-inter-semibold text-on-surface">
                    Повышенный кэшбэк
                  </Text>
                  <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
                    Выберите до 2 категорий — Мобики будут начисляться ×2
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {cashback.availableCategories.map((category) => {
                    const selected = selectedCategories.includes(category.code);

                    return (
                      <Pressable
                        key={category.code}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        onPress={() => toggleCategory(category.code)}
                        className={`min-w-[46%] flex-1 gap-1 rounded-xl border-2 px-3 py-2.5 ${
                          selected
                            ? 'border-primary-container bg-primary-soft'
                            : 'border-transparent bg-surface-low'
                        }`}
                        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                        <Text className="text-body-md font-inter-semibold text-on-surface">
                          {category.icon} {category.name}
                        </Text>
                        <Text className="text-label-sm font-inter text-on-surface-variant">
                          ×{category.multiplier} Мобиков
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {cashbackChanged ? (
                  <Button
                    label="Сохранить категории"
                    icon="check"
                    size="md"
                    loading={savingCashback}
                    disabled={selectedCategories.length === 0}
                    onPress={handleSaveCashback}
                  />
                ) : cashbackMessage ? (
                  <Text className="text-label-sm font-inter text-success">{cashbackMessage}</Text>
                ) : null}
              </Card>
            ) : null}

            <View className="gap-2">
              <Text className="text-headline-sm font-inter-semibold text-on-surface">
                Акции партнёров
              </Text>
              {offers && offers.offers.length > 0 ? (
                offers.offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    balance={offers.mobiksBalance}
                    redeeming={redeemingId === offer.id}
                    onRedeem={() => handleRedeem(offer.id)}
                  />
                ))
              ) : (
                <Card className="p-margin">
                  <Text className="text-center text-body-sm font-inter text-on-surface-variant">
                    Сейчас акций нет — загляните позже.
                  </Text>
                </Card>
              )}
            </View>

            {offers && offers.purchasedRewards.length > 0 ? (
              <View className="gap-2">
                <Text className="text-headline-sm font-inter-semibold text-on-surface">
                  Мои промокоды
                </Text>
                {offers.purchasedRewards.map((reward) => (
                  <Card key={reward.id} className="gap-1.5 p-4">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="min-w-0 flex-1">
                        <Text className="text-label-sm font-inter-semibold uppercase tracking-wider text-outline">
                          {reward.partnerName}
                        </Text>
                        <Text className="text-label-lg font-inter-semibold text-on-surface">
                          {reward.title}
                        </Text>
                      </View>
                      <Text className="text-label-sm font-inter text-outline">
                        {formatTransactionDate(reward.createdAt)}
                      </Text>
                    </View>
                    <View className="self-start rounded-lg bg-surface-container px-3 py-1.5">
                      <Text className="text-label-md font-inter-bold tracking-wider text-on-surface">
                        {reward.promoCode}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

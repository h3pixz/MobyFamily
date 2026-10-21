import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { deletePiggyBank, fetchPiggyBanks } from '@/api/piggy-banks';
import { useAuth } from '@/auth/auth-context';
import { FamilyHeader } from '@/components/family/family-header';
import { PiggyBankCard } from '@/components/piggy-bank/piggy-bank-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { getFirstName } from '@/utils/greeting';

export default function PiggyBanksScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');
  const [piggyBanks, setPiggyBanks] = useState<PiggyBankResponseDto[]>([]);
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void reloadKey;

      let cancelled = false;

      setLoading(true);

      Promise.allSettled([fetchPiggyBanks(), fetchFamily()]).then(
        ([piggyBanksResult, familyResult]) => {
          if (cancelled) {
            return;
          }

          if (piggyBanksResult.status === 'fulfilled') {
            setPiggyBanks(
              [...piggyBanksResult.value].sort((a, b) => {
                if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') {
                  return -1;
                }
                if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') {
                  return 1;
                }

                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }),
            );
            setError(null);
          } else {
            setError(getApiErrorMessage(piggyBanksResult.reason));
          }

          if (familyResult.status === 'fulfilled') {
            setFamily(familyResult.value);
          }

          setLoading(false);
        },
      );

      return () => {
        cancelled = true;
      };
    }, [reloadKey]),
  );

  const reload = () => setReloadKey((current) => current + 1);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isChild ? '/child' : '/');
  };

  const getOwnerName = (ownerId: string) => {
    if (isChild) {
      return undefined;
    }

    const child = family?.children.find((item) => item.id === ownerId);

    return child ? getFirstName(child.name) : undefined;
  };

  const handleDelete = (piggyBank: PiggyBankResponseDto) => {
    Alert.alert(
      'Удалить копилку?',
      'Накопленная сумма вернётся на карту ребёнка.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePiggyBank(piggyBank.id);
              reload();
            } catch (deleteError) {
              Alert.alert('Не удалось удалить копилку', getApiErrorMessage(deleteError));
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="Копилки"
          onPressBack={goBack}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 12,
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
            {isChild ? (
              <Button
                label="Новая копилка"
                icon="add"
                size="lg"
                className="w-full rounded-xl"
                onPress={() => router.push('/piggy-bank-form')}
              />
            ) : null}

            {piggyBanks.length === 0 ? (
              <Card className="gap-1 p-margin">
                <Text className="text-center text-label-lg font-inter-semibold text-on-surface">
                  Копилок пока нет
                </Text>
                <Text className="text-center text-body-sm font-inter text-on-surface-variant">
                  {isChild
                    ? 'Создайте цель мечты и пополняйте её вместе с семьёй.'
                    : 'Копилки детей появятся здесь.'}
                </Text>
              </Card>
            ) : (
              piggyBanks.map((piggyBank) => {
                const ownerName = getOwnerName(piggyBank.owner.id);
                const canManage =
                  isChild && (!family || piggyBank.owner.id === family.user.id);

                return (
                  <PiggyBankCard
                    key={piggyBank.id}
                    piggyBank={piggyBank}
                    ownerName={ownerName}
                    canManage={canManage}
                    onTopUp={() =>
                      router.push({
                        pathname: '/piggy-bank-top-up',
                        params: { id: piggyBank.id },
                      })
                    }
                    onEdit={
                      canManage
                        ? () =>
                            router.push({
                              pathname: '/piggy-bank-form',
                              params: { id: piggyBank.id },
                            })
                        : undefined
                    }
                    onWithdraw={
                      canManage
                        ? () =>
                            router.push({
                              pathname: '/piggy-bank-withdraw',
                              params: { id: piggyBank.id },
                            })
                        : undefined
                    }
                    onDelete={canManage ? () => handleDelete(piggyBank) : undefined}
                  />
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

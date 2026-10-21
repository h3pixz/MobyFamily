import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { fetchGraduationStatus, graduate } from '@/api/family';
import type { GraduationStatusResponseDto } from '@/api/gen/models/GraduationStatusResponseDto';
import { useAuth } from '@/auth/auth-context';
import { FamilyHeader } from '@/components/family/family-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatPoints } from '@/utils/format';

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<GraduationStatusResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graduating, setGraduating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchGraduationStatus()
        .then((data) => {
          if (!cancelled) {
            setStatus(data);
            setError(null);
          }
        })
        .catch((loadError) => {
          if (!cancelled) {
            setError(getApiErrorMessage(loadError));
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
    }, []),
  );

  const handleGraduate = () => {
    Alert.alert(
      'Стать самостоятельным?',
      'Родители будут отвязаны, детские лимиты и ограничения по картам снимутся. Счета, копилки и история сохранятся.',
      [
        { text: 'Позже', style: 'cancel' },
        {
          text: 'Перейти',
          onPress: async () => {
            setGraduating(true);

            try {
              const response = await graduate();
              await refreshProfile().catch(() => {});
              Alert.alert('Поздравляем!', response.message, [
                { text: 'ОК', onPress: () => router.replace('/') },
              ]);
            } catch (graduateError) {
              Alert.alert('Не удалось выполнить переход', getApiErrorMessage(graduateError));
            } finally {
              setGraduating(false);
            }
          },
        },
      ],
    );
  };

  const progress = Math.min(100, Math.max(0, status?.progressPercentage ?? 0));
  const isAdult = status?.currentRole === 'ORDINARY' || status?.currentRole === 'PARENT';

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="Квест 17.5"
          onPressBack={() => (router.canGoBack() ? router.back() : router.replace('/child'))}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 14,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="small" color="#1D63ED" />
          </View>
        ) : error || !status ? (
          <View className="items-center gap-2 py-16">
            <Icon name="error-outline" size={28} color="#BA1A1A" />
            <Text className="text-center text-body-md font-inter text-on-surface-variant">
              {error ?? 'Не удалось загрузить статус'}
            </Text>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={['#2E3132', '#191C1E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 18, borderRadius: 18 }}>
              <View className="flex-row items-center justify-between gap-2">
                <View className="rounded-full border border-secondary-container/40 bg-secondary-container/20 px-2 py-0.5">
                  <Text className="text-[10px] font-inter-bold text-secondary-fixed">
                    {status.age} лет · {isAdult ? 'Взрослый банкинг' : 'Путь к 18'}
                  </Text>
                </View>
                <Text className="text-label-md font-inter-semibold text-white/70">
                  {progress}%
                </Text>
              </View>

              <Text className="mt-2 text-body-lg font-inter-bold tracking-tight text-white">
                Путь к 18 🚀
              </Text>
              <Text className="mt-1 text-[12px] font-inter leading-relaxed text-white/70">
                Выполняй миссии, копи на мечты и подготовься к взрослой карте Moby.
              </Text>

              <View className="mt-3">
                <ProgressBar
                  value={progress / 100}
                  trackClassName="bg-white/15"
                  barClassName="bg-secondary-container"
                  heightClassName="h-2"
                />
              </View>
            </LinearGradient>

            <View className="flex-row flex-wrap gap-2">
              <StatCard label="Копилки" value={String(status.completedPiggyBanksCount)} />
              <StatCard label="Задания" value={String(status.completedTasksCount)} />
              <StatCard label="Покупки" value={String(status.transactionsCount)} />
              <StatCard label="Мобики" value={formatPoints(status.mobiksBalance)} />
            </View>

            <View className="gap-2">
              <Text className="text-headline-sm font-inter-semibold text-on-surface">Миссии</Text>
              {status.checkpoints.map((checkpoint) => (
                <Card key={checkpoint.title} className="flex-row items-start gap-3 p-3.5">
                  <View
                    className={`mt-0.5 h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                      checkpoint.isCompleted ? 'bg-success-soft' : 'bg-surface-container'
                    }`}>
                    <Icon
                      name={checkpoint.isCompleted ? 'check' : 'lock-outline'}
                      size={16}
                      color={checkpoint.isCompleted ? '#006242' : '#737686'}
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-label-lg font-inter-semibold text-on-surface">
                      {checkpoint.title}
                    </Text>
                    <Text className="text-body-sm font-inter text-on-surface-variant">
                      {checkpoint.description}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>

            {isAdult ? (
              <Card className="gap-1 p-4">
                <Text className="text-center text-label-lg font-inter-semibold text-on-surface">
                  Вы уже во взрослом банкинге
                </Text>
                <Text className="text-center text-body-sm font-inter text-on-surface-variant">
                  Все ограничения сняты, родительский контроль отключён.
                </Text>
              </Card>
            ) : (
              <>
                <Button
                  label="Стать самостоятельным"
                  icon="rocket-launch"
                  size="lg"
                  className="w-full rounded-xl"
                  loading={graduating}
                  disabled={!status.isEligibleForGraduation || graduating}
                  onPress={handleGraduate}
                />

                {!status.isEligibleForGraduation ? (
                  <Text className="text-center text-label-sm font-inter text-on-surface-variant">
                    Выполните все миссии, чтобы перейти во взрослый банкинг.
                  </Text>
                ) : null}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="min-w-[46%] flex-1 gap-0.5 p-3.5">
      <Text className="text-label-sm font-inter text-on-surface-variant">{label}</Text>
      <Text className="text-headline-sm font-inter-bold text-on-surface">{value}</Text>
    </Card>
  );
}

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { fetchFamily, removeFamilyMember } from '@/api/family';
import type { FamilyResponseDto } from '@/api/gen/models/FamilyResponseDto';
import { useAuth } from '@/auth/auth-context';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { FamilyHeader } from '@/components/family/family-header';
import { FamilyManagement } from '@/components/family/family-management';
import { Icon } from '@/components/ui/icon';
import type { FamilyMember } from '@/types/dashboard';
import { toFamilyMember, toSelfParentMember } from '@/utils/family';

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const [family, setFamily] = useState<FamilyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void reloadKey;

      let cancelled = false;

      fetchFamily()
        .then((data) => {
          if (!cancelled) {
            setFamily(data);
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
    }, [reloadKey]),
  );

  const members = [
    ...(family?.children.map(toFamilyMember) ?? []),
    ...(family ? [toSelfParentMember(family.user)] : []),
  ];

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const handleRemove = (member: FamilyMember) => {
    Alert.alert(
      member.kind === 'child' ? 'Удалить профиль?' : 'Исключить из семьи?',
      member.kind === 'child'
        ? `${member.name} больше не будет привязан к вашей семье.`
        : `${member.name} потеряет доступ к семейному аккаунту.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFamilyMember(member.id);
              setReloadKey((current) => current + 1);
              await refreshProfile().catch(() => {});
            } catch (removeError) {
              Alert.alert('Не удалось удалить', getApiErrorMessage(removeError));
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
          <FamilyManagement
            members={members}
            onPressAdd={() => router.push('/add-member')}
            onRemove={handleRemove}
          />
        )}
      </ScrollView>

      <BottomNav
        activeTab="family"
        onPress={(tab) => {
          if (tab.key === 'profile') {
            router.push('/profile');
          } else if (tab.key === 'savings') {
            router.push('/piggy-banks');
          } else if (tab.key !== 'family') {
            openSoon(tab.label);
          }
        }}
      />
    </View>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatStoredPhone } from '@/utils/phone';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

function getRoleLabel(role?: string) {
  if (role?.startsWith('CHILD')) {
    return 'Ребёнок · 7–13 лет';
  }
  if (role?.startsWith('TEEN')) {
    return 'Подросток · 14–17 лет';
  }
  if (role === 'PARENT') {
    return 'Родитель';
  }

  return 'Клиент Moby Family';
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center px-margin">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            className="-ml-2 h-11 w-11 items-center justify-center rounded-full"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
            <Icon name="arrow-back" size={24} color="#191C1E" />
          </Pressable>

          <Text className="flex-1 px-2 text-center text-headline-sm font-inter-semibold tracking-tight text-on-surface">
            Профиль
          </Text>

          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-3 rounded-2xl bg-surface-lowest p-6" style={shadow}>
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-soft">
            <Icon name="person" size={40} color="#1D63ED" />
          </View>

          <View className="items-center gap-1">
            <Text className="text-headline-sm font-inter-semibold text-on-surface">
              {profile?.name ?? 'Пользователь Moby'}
            </Text>
            <Text className="text-body-md font-inter text-on-surface-variant">
              {profile?.phoneNumber ? formatStoredPhone(profile.phoneNumber) : ''}
            </Text>
          </View>

          <View className="rounded-full bg-primary-soft px-3 py-1">
            <Text className="text-label-sm font-inter-medium text-primary">
              {getRoleLabel(profile?.role)}
            </Text>
          </View>
        </View>

        <Button
          label="Выйти из аккаунта"
          icon="logout"
          variant="secondary"
          size="lg"
          className="w-full"
          loading={signingOut}
          onPress={handleSignOut}
        />
      </ScrollView>
    </View>
  );
}

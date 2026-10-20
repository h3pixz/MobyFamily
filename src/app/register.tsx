import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { AuthWelcome } from '@/components/auth/auth-welcome';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  return (
    <View className="flex-1 bg-surface">
      <View pointerEvents="none" className="absolute inset-x-0 top-0 h-96 overflow-hidden">
        <View className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-container/5" />
        <View
          className="absolute -left-10 -top-8 h-40 w-40 rounded-2xl bg-primary-container/5"
          style={{ transform: [{ rotate: '25deg' }] }}
        />
        <View className="absolute right-16 top-44 h-2 w-2 rounded-full bg-primary-container/25" />
        <View className="absolute right-24 top-56 h-1.5 w-1.5 rounded-full bg-primary-container/15" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AuthHeader />
          <AuthWelcome />
          <AuthTabs
            activeTab="register"
            onChange={(tab) => {
              if (tab === 'login') {
                openSoon('Вход');
              }
            }}
          />

          <View className="px-4">
            <RegisterForm
              onSubmit={() => router.replace('/')}
              onOpenDocument={openSoon}
            />
          </View>

          <View className="items-center px-4 pt-5">
            <View className="flex-row flex-wrap items-center justify-center">
              <Text className="text-body-md text-on-surface-variant">Уже есть аккаунт? </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Войти"
                onPress={() => openSoon('Вход')}
                hitSlop={8}>
                <Text className="text-label-lg font-inter-semibold text-primary">Войти</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

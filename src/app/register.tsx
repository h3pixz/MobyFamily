import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBackground } from '@/components/auth/auth-background';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthSwitch } from '@/components/auth/auth-switch';
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
      <AuthBackground />

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
          <AuthWelcome
            title="Добро пожаловать!"
            emoji="✨"
            subtitle="Единый вход в семейный банкинг МТБанка"
          />
          <AuthTabs
            activeTab="register"
            onChange={(tab) => {
              if (tab === 'login') {
                router.push('/login');
              }
            }}
          />

          <View className="px-4">
            <RegisterForm
              onSubmit={() => router.replace('/')}
              onOpenDocument={openSoon}
            />
          </View>

          <AuthSwitch
            prompt="Уже есть аккаунт?"
            actionLabel="Войти"
            onPress={() => router.push('/login')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

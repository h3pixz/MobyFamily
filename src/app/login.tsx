import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBackground } from '@/components/auth/auth-background';
import { AuthSwitch } from '@/components/auth/auth-switch';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { AuthWelcome } from '@/components/auth/auth-welcome';
import { LoginForm } from '@/components/auth/login-form';
import { LoginHeader } from '@/components/auth/login-header';

export default function LoginScreen() {
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
          <LoginHeader onPressSupport={() => openSoon('Поддержка')} />
          <AuthWelcome
            title="С возвращением!"
            emoji="👋"
            subtitle="Единый вход в семейный банкинг МТБанка"
          />
          <AuthTabs
            activeTab="login"
            onChange={(tab) => {
              if (tab === 'register') {
                router.push('/register');
              }
            }}
          />

          <View className="px-4">
            <LoginForm
              onSubmit={() => router.replace('/')}
              onForgotPassword={() => openSoon('Восстановление пароля')}
            />
          </View>

          <AuthSwitch
            prompt="Нет аккаунта?"
            actionLabel="Зарегистрироваться"
            onPress={() => router.push('/register')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

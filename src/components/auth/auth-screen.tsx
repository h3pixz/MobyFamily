import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthBackground } from '@/components/auth/auth-background';
import { AuthSwitch } from '@/components/auth/auth-switch';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { AuthWelcome } from '@/components/auth/auth-welcome';
import { LoginForm } from '@/components/auth/login-form';
import { LoginHeader } from '@/components/auth/login-header';
import { RegisterForm } from '@/components/auth/register-form';
import type { AuthTab } from '@/types/auth';

type AuthScreenProps = {
  initialTab: AuthTab;
};

export function AuthScreen({ initialTab }: AuthScreenProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const openSoon = (title: string) => {
    router.push({ pathname: '/soon', params: { title } });
  };

  const changeTab = (next: AuthTab) => {
    if (next === tab) {
      return;
    }

    Keyboard.dismiss();
    setTab(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const isLogin = tab === 'login';

  return (
    <View className="flex-1 bg-surface">
      <AuthBackground />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
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
            title={isLogin ? 'С возвращением!' : 'Добро пожаловать!'}
            emoji={isLogin ? '👋' : '✨'}
            subtitle="Единый вход в семейный банкинг МТБанка"
          />

          <AuthTabs activeTab={tab} onChange={changeTab} />

          <View className="px-4">
            {isLogin ? (
              <LoginForm
                onSubmit={() => router.replace('/')}
                onForgotPassword={() => openSoon('Восстановление пароля')}
              />
            ) : (
              <RegisterForm
                onSubmit={() => router.replace('/')}
                onOpenDocument={openSoon}
              />
            )}
          </View>

          <AuthSwitch
            prompt={isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            actionLabel={isLogin ? 'Зарегистрироваться' : 'Войти'}
            onPress={() => changeTab(isLogin ? 'register' : 'login')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

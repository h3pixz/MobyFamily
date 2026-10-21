import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { isChildRole } from '@/api/auth';
import { AuthProvider, useAuth } from '@/auth/auth-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

const AUTH_ROUTES = new Set(['login', 'register']);
const OPEN_ROUTES = new Set(['login', 'register', 'policy', 'soon']);
const CHILD_ROUTES = new Set(['child', 'profile', 'qr', 'soon', 'policy', 'piggy-bank-top-up']);

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { status, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const ready = fontsReady && status !== 'loading';
  const currentRoute = segments[0] ?? '';

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (status === 'unauthenticated') {
      if (!OPEN_ROUTES.has(currentRoute)) {
        router.replace('/login');
      }
      return;
    }

    if (status === 'authenticated') {
      const isChild = isChildRole(profile?.role ?? '');

      if (AUTH_ROUTES.has(currentRoute)) {
        router.replace(isChild ? '/child' : '/');
      } else if (isChild && !CHILD_ROUTES.has(currentRoute)) {
        router.replace('/child');
      } else if (!isChild && currentRoute === 'child') {
        router.replace('/');
      }
    }
  }, [ready, status, profile, currentRoute, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F9FB' },
        }}>
        <Stack.Screen
          name="piggy-bank-top-up"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="limit-settings"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  return (
    <AuthProvider>
      <RootNavigator fontsReady={Boolean(fontsLoaded || fontError)} />
    </AuthProvider>
  );
}

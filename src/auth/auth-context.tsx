import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  fetchProfile,
  loginWithPhone,
  logout as logoutRequest,
  registerAccount,
  type AuthProfile,
} from '@/api/auth';
import {
  clearSession,
  getAccessToken,
  loadSession,
  onSessionExpired,
} from '@/api/session';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type RegisterInput = {
  name: string;
  phone: string;
  password: string;
  birthDay: string;
};

type AuthContextValue = {
  status: AuthStatus;
  profile: AuthProfile | null;
  signIn: (phone: string, password: string, remember: boolean) => Promise<AuthProfile>;
  signUp: (input: RegisterInput) => Promise<AuthProfile>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [profile, setProfile] = useState<AuthProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const stopListening = onSessionExpired(() => {
      if (!cancelled) {
        setProfile(null);
        setStatus('unauthenticated');
      }
    });

    const restore = async () => {
      await loadSession();

      if (!getAccessToken()) {
        if (!cancelled) {
          setStatus('unauthenticated');
        }
        return;
      }

      try {
        const restored = await fetchProfile();

        if (!cancelled) {
          setProfile(restored);
          setStatus('authenticated');
        }
      } catch {
        await clearSession();

        if (!cancelled) {
          setProfile(null);
          setStatus('unauthenticated');
        }
      }
    };

    restore().catch(() => {
      if (!cancelled) {
        setStatus('unauthenticated');
      }
    });

    return () => {
      cancelled = true;
      stopListening();
    };
  }, []);

  const signIn = async (phone: string, password: string, remember: boolean) => {
    const next = await loginWithPhone(phone, password, remember);
    setProfile(next);
    setStatus('authenticated');
    return next;
  };

  const signUp = async (input: RegisterInput) => {
    const next = await registerAccount(input);
    setProfile(next);
    setStatus('authenticated');
    return next;
  };

  const signOut = async () => {
    await logoutRequest().catch(() => {});
    setProfile(null);
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ status, profile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}

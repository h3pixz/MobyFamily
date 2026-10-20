import './client';

import {
  authControllerGetProfile,
  authControllerLogin,
  authControllerLogout,
  authControllerRegister,
} from './gen/clients';
import type { AuthResponseDto } from './gen/models/AuthResponseDto';
import type { UserProfileDto } from './gen/models/UserProfileDto';
import { clearSession, saveSession } from './session';
import { toPhoneNumber } from '@/utils/phone';

export type AuthProfile = UserProfileDto & {
  name?: string;
};

async function completeAuth(tokens: AuthResponseDto, persist: boolean): Promise<AuthProfile> {
  await saveSession(tokens, persist, tokens.user.name);

  const profile = await authControllerGetProfile({});

  return { ...profile, name: tokens.user.name };
}

export async function fetchProfile() {
  return authControllerGetProfile({});
}

export async function loginWithPhone(phone: string, password: string, remember = true) {
  const tokens = await authControllerLogin({
    body: { phoneNumber: toPhoneNumber(phone), password },
  });

  return completeAuth(tokens, remember);
}

export async function registerAccount(input: {
  name: string;
  phone: string;
  password: string;
  birthDay: string;
}) {
  const tokens = await authControllerRegister({
    body: {
      name: input.name,
      phoneNumber: toPhoneNumber(input.phone),
      password: input.password,
      birthDay: input.birthDay,
    },
  });

  return completeAuth(tokens, true);
}

export async function logout() {
  try {
    await authControllerLogout({});
  } finally {
    await clearSession();
  }
}

export function isChildRole(role: string) {
  return role.startsWith('CHILD') || role.startsWith('TEEN');
}

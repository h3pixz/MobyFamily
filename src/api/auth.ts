import './client';

import { authControllerGetProfile, authControllerLogin, authControllerRegister } from './gen/clients';
import { saveSession } from './session';
import { toPhoneNumber } from '@/utils/phone';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

async function completeAuth(tokens: AuthTokens, persist: boolean) {
  await saveSession(tokens, persist);

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

export function isChildRole(role: string) {
  return role.startsWith('CHILD') || role.startsWith('TEEN');
}

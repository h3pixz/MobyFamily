import './client';

import {
  usersControllerGetFamily,
  usersControllerGetGraduationStatus,
  usersControllerLinkChild,
  usersControllerUpdateCardLimits,
} from './gen/clients';
import type { UsersControllerLinkChildBodyFormData } from './gen/models/UsersControllerLinkChild';
import { toPhoneNumber } from '@/utils/phone';

export type PassportFile = {
  uri: string;
  name: string;
  type: string;
};

export async function fetchFamily() {
  return usersControllerGetFamily({});
}

export async function fetchGraduationStatus() {
  return usersControllerGetGraduationStatus({});
}

export async function updateCardLimits(input: {
  cardId: string;
  dailyLimit: number;
  pocketMoneyAmount: number;
  pocketMoneyDay: number;
}) {
  return usersControllerUpdateCardLimits({
    path: { cardId: input.cardId },
    body: {
      dailyLimit: input.dailyLimit,
      pocketMoneyAmount: input.pocketMoneyAmount,
      pocketMoneyDay: input.pocketMoneyDay,
    },
  });
}

export async function linkChild(input: { phone: string; passport: PassportFile }) {
  const formData = new FormData();
  formData.append('phoneNumber', toPhoneNumber(input.phone));
  formData.append('passport', input.passport as unknown as Blob);

  return usersControllerLinkChild({
    body: formData as unknown as UsersControllerLinkChildBodyFormData,
  });
}

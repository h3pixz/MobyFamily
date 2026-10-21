import './client';

import {
  usersControllerAddChild,
  usersControllerGetFamily,
  usersControllerGetGraduationStatus,
  usersControllerGraduate,
  usersControllerLinkChild,
  usersControllerRemoveChild,
  usersControllerRemoveFamilyMember,
  usersControllerRemoveParent,
  usersControllerResetSpentToday,
  usersControllerUpdateCardLimits,
} from './gen/clients';
import type { UpdateCardLimitsDto } from './gen/models/UpdateCardLimitsDto';
import type { UsersControllerLinkChildBodyFormData } from './gen/models/UsersControllerLinkChild';
import { toPhoneNumber } from '@/utils/phone';

export type PassportFile = {
  uri: string;
  name: string;
  type: string;
};

export type CardLimitsInput = {
  cardId: string;
  dailyLimit: number;
  pocketMoneyAmount?: number;
  pocketMoneyDay?: number;
  allowOnlinePurchases?: boolean;
  allowCashWithdrawal?: boolean;
  isBlocked?: boolean;
};

export async function fetchFamily() {
  return usersControllerGetFamily({});
}

export async function fetchGraduationStatus() {
  return usersControllerGetGraduationStatus({});
}

export async function updateCardLimits(input: CardLimitsInput) {
  const body: UpdateCardLimitsDto = { dailyLimit: input.dailyLimit };

  if (input.allowOnlinePurchases !== undefined) {
    body.allowOnlinePurchases = input.allowOnlinePurchases;
  }
  if (input.allowCashWithdrawal !== undefined) {
    body.allowCashWithdrawal = input.allowCashWithdrawal;
  }
  if (input.isBlocked !== undefined) {
    body.isBlocked = input.isBlocked;
  }
  if (input.pocketMoneyAmount !== undefined && Number.isFinite(input.pocketMoneyAmount)) {
    body.pocketMoneyAmount = input.pocketMoneyAmount;
  }
  if (input.pocketMoneyDay !== undefined && Number.isFinite(input.pocketMoneyDay)) {
    body.pocketMoneyDay = input.pocketMoneyDay;
  }

  return usersControllerUpdateCardLimits({ path: { cardId: input.cardId }, body });
}

export async function resetSpentToday(cardId: string) {
  return usersControllerResetSpentToday({ path: { cardId } });
}

export async function addChild(input: {
  phone: string;
  password: string;
  name: string;
  birthDay: string;
  initialBalance?: number;
  dailyLimit?: number;
}) {
  return usersControllerAddChild({
    body: {
      phoneNumber: toPhoneNumber(input.phone),
      password: input.password,
      name: input.name,
      birthDay: input.birthDay,
      initialBalance: input.initialBalance,
      dailyLimit: input.dailyLimit,
    },
  });
}

export async function linkChild(input: { phone: string; passport?: PassportFile }) {
  const formData = new FormData();
  formData.append('phoneNumber', toPhoneNumber(input.phone));

  if (input.passport) {
    formData.append('passport', input.passport as unknown as Blob);
  }

  return usersControllerLinkChild({
    body: formData as unknown as UsersControllerLinkChildBodyFormData,
  });
}

export async function removeChild(childId: string) {
  return usersControllerRemoveChild({ path: { childId } });
}

export async function removeParent(parentId: string) {
  return usersControllerRemoveParent({ path: { parentId } });
}

export async function removeFamilyMember(memberId: string) {
  return usersControllerRemoveFamilyMember({ path: { memberId } });
}

export async function graduate() {
  return usersControllerGraduate({});
}

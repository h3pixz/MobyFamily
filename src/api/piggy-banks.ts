import './client';

import {
  piggyBanksControllerCreatePiggyBank,
  piggyBanksControllerDeletePiggyBank,
  piggyBanksControllerGetPiggyBankById,
  piggyBanksControllerGetPiggyBanks,
  piggyBanksControllerTopUpPiggyBank,
  piggyBanksControllerUpdatePiggyBank,
  piggyBanksControllerWithdrawPiggyBank,
} from './gen/clients';
import type { CreatePiggyBankDto } from './gen/models/CreatePiggyBankDto';
import type { UpdatePiggyBankDto } from './gen/models/UpdatePiggyBankDto';
import type { WithdrawPiggyBankDto } from './gen/models/WithdrawPiggyBankDto';

export async function fetchPiggyBanks() {
  return piggyBanksControllerGetPiggyBanks({});
}

export async function fetchPiggyBank(id: string) {
  return piggyBanksControllerGetPiggyBankById({ path: { id } });
}

export async function createPiggyBank(input: CreatePiggyBankDto) {
  return piggyBanksControllerCreatePiggyBank({ body: input });
}

export async function updatePiggyBank(id: string, input: UpdatePiggyBankDto) {
  return piggyBanksControllerUpdatePiggyBank({ path: { id }, body: input });
}

export async function deletePiggyBank(id: string) {
  return piggyBanksControllerDeletePiggyBank({ path: { id } });
}

export async function topUpPiggyBank(input: {
  id: string;
  amount: number;
  comment?: string;
  cardId?: string;
}) {
  return piggyBanksControllerTopUpPiggyBank({
    path: { id: input.id },
    body: { amount: input.amount, comment: input.comment, cardId: input.cardId },
  });
}

export async function withdrawPiggyBank(input: WithdrawPiggyBankDto & { id: string }) {
  return piggyBanksControllerWithdrawPiggyBank({
    path: { id: input.id },
    body: { cardId: input.cardId, breakPiggyBank: input.breakPiggyBank },
  });
}

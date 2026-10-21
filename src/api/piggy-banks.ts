import './client';

import {
  piggyBanksControllerGetPiggyBankById,
  piggyBanksControllerGetPiggyBanks,
  piggyBanksControllerTopUpPiggyBank,
} from './gen/clients';

export async function fetchPiggyBanks() {
  return piggyBanksControllerGetPiggyBanks({});
}

export async function fetchPiggyBank(id: string) {
  return piggyBanksControllerGetPiggyBankById({ path: { id } });
}

export async function topUpPiggyBank(input: { id: string; amount: number; cardId?: string }) {
  return piggyBanksControllerTopUpPiggyBank({
    path: { id: input.id },
    body: { amount: input.amount, cardId: input.cardId },
  });
}

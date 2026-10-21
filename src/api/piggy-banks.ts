import './client';

import { piggyBanksControllerGetPiggyBanks } from './gen/clients';

export async function fetchPiggyBanks() {
  return piggyBanksControllerGetPiggyBanks({});
}

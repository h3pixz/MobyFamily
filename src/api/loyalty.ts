import './client';

import { loyaltyControllerGetCashbackCategories } from './gen/clients';

export async function fetchCashbackCategories() {
  return loyaltyControllerGetCashbackCategories({});
}

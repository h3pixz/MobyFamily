import './client';

import {
  loyaltyControllerGetCashbackCategories,
  loyaltyControllerGetOffers,
  loyaltyControllerRedeemOffer,
  loyaltyControllerSelectCashbackCategories,
} from './gen/clients';

export async function fetchLoyaltyOffers() {
  return loyaltyControllerGetOffers({});
}

export async function redeemOffer(offerId: string) {
  return loyaltyControllerRedeemOffer({ path: { offerId } });
}

export async function fetchCashbackCategories() {
  return loyaltyControllerGetCashbackCategories({});
}

export async function selectCashbackCategories(categories: string[]) {
  return loyaltyControllerSelectCashbackCategories({ body: { categories } });
}

import './client';

import { paymentsControllerGetMyTransactions } from './gen/clients';

export async function fetchMyTransactions(limit = 6) {
  return paymentsControllerGetMyTransactions({ query: { limit } });
}

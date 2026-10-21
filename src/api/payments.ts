import './client';

import { paymentsControllerGetMyTransactions, paymentsControllerPayByQr } from './gen/clients';
import type { PayQrDto } from './gen/models/PayQrDto';

export async function fetchMyTransactions(limit = 6) {
  return paymentsControllerGetMyTransactions({ query: { limit } });
}

export async function payByQr(dto: PayQrDto) {
  return paymentsControllerPayByQr({ body: dto });
}

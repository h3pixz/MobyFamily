import './client';

import {
  paymentsControllerGetMemberTransactions,
  paymentsControllerGetMyTransactions,
  paymentsControllerPayByQr,
} from './gen/clients';
import type { PayQrDto } from './gen/models/PayQrDto';

export async function fetchMyTransactions(limit = 6) {
  return paymentsControllerGetMyTransactions({ query: { limit } });
}

export async function fetchMemberTransactions(memberId: string, limit = 100) {
  return paymentsControllerGetMemberTransactions({ path: { memberId }, query: { limit } });
}

export async function payByQr(dto: PayQrDto) {
  return paymentsControllerPayByQr({ body: dto });
}

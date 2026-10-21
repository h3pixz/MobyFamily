import './client';

import {
  paymentsControllerApproveTransferRequest,
  paymentsControllerCreateTransferRequest,
  paymentsControllerDeclineTransferRequest,
  paymentsControllerGetFamilyTransactions,
  paymentsControllerGetMemberTransactions,
  paymentsControllerGetMyTransactions,
  paymentsControllerGetTransferRequests,
  paymentsControllerPayByQr,
  paymentsControllerTransferByPhone,
  paymentsControllerTransferToChild,
} from './gen/clients';
import type { CreateTransferRequestDto } from './gen/models/CreateTransferRequestDto';
import type { P2PTransferByPhoneDto } from './gen/models/P2PTransferByPhoneDto';
import type { ParentToChildTransferDto } from './gen/models/ParentToChildTransferDto';
import type { PayQrDto } from './gen/models/PayQrDto';

export async function fetchMyTransactions(limit = 6) {
  return paymentsControllerGetMyTransactions({ query: { limit } });
}

export async function fetchMemberTransactions(memberId: string, limit = 100) {
  return paymentsControllerGetMemberTransactions({ path: { memberId }, query: { limit } });
}

export async function fetchFamilyTransactions(limit = 100) {
  return paymentsControllerGetFamilyTransactions({ query: { limit } });
}

export async function payByQr(dto: PayQrDto) {
  return paymentsControllerPayByQr({ body: dto });
}

export async function fetchTransferRequests() {
  return paymentsControllerGetTransferRequests({});
}

export async function createTransferRequest(input: CreateTransferRequestDto) {
  return paymentsControllerCreateTransferRequest({ body: input });
}

export async function approveTransferRequest(id: string, parentCardId?: string) {
  return paymentsControllerApproveTransferRequest({
    path: { id },
    body: parentCardId ? { parentCardId } : {},
  });
}

export async function declineTransferRequest(id: string, reason?: string) {
  return paymentsControllerDeclineTransferRequest({
    path: { id },
    body: reason ? { reason } : {},
  });
}

export async function transferToChild(input: ParentToChildTransferDto) {
  return paymentsControllerTransferToChild({ body: input });
}

export async function transferByPhone(input: P2PTransferByPhoneDto) {
  return paymentsControllerTransferByPhone({ body: input });
}

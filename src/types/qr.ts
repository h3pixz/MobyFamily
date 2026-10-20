export type QrModeId = 'payment' | 'erip' | 'transfer';

export interface QrMode {
  id: QrModeId;
  label: string;
  hint: string;
}

export interface QrPaymentSource {
  title: string;
  last4: string;
  balance: number;
}

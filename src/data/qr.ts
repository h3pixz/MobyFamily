import { childProfile } from '@/data/dashboard';
import type { QrPaymentSource } from '@/types/qr';

export const qrPaymentSource: QrPaymentSource = {
  title: 'Moby junior',
  last4: childProfile.cardLast4,
  balance: childProfile.purchaseBalance,
};

export const myQrValue = `mobyfamily://pay?card=${childProfile.cardLast4}&name=${encodeURIComponent(childProfile.name)}`;

import { childProfile } from '@/data/dashboard';
import type { QrMode, QrPaymentSource } from '@/types/qr';

export const qrModes: QrMode[] = [
  {
    id: 'payment',
    label: 'Оплата по QR',
    hint: 'Наведите камеру на QR-код для моментальной оплаты или перевода',
  },
  {
    id: 'erip',
    label: 'ЕРИП QR',
    hint: 'Наведите камеру на QR-код ЕРИП, чтобы оплатить услугу',
  },
  {
    id: 'transfer',
    label: 'Перевод',
    hint: 'Наведите камеру на QR-код получателя перевода',
  },
];

export const qrPaymentSource: QrPaymentSource = {
  title: 'Moby junior',
  last4: childProfile.cardLast4,
  balance: childProfile.purchaseBalance,
};

export const myQrValue = `mobyfamily://pay?card=${childProfile.cardLast4}&name=${encodeURIComponent(childProfile.name)}`;

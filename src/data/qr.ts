import type { PayQrDto } from '@/api/gen/models/PayQrDto';
import { childProfile } from '@/data/dashboard';
import type { QrPaymentSource } from '@/types/qr';

export const qrPaymentSource: QrPaymentSource = {
  title: 'Moby junior',
  last4: childProfile.cardLast4,
  balance: childProfile.purchaseBalance,
};

export const demoQrPayment: PayQrDto = {
  merchant: 'Евроопт',
  items: [
    { name: 'Хлеб «Нарочанский», 500 г', mcc: '5411', amount: 2.19 },
    { name: 'Молоко «Савушкин» 3,2%, 1 л', mcc: '5411', amount: 2.49 },
    { name: 'Яйца «Снов» С1, 10 шт', mcc: '5411', amount: 4.29 },
    { name: 'Яблоки белорусские, 1 кг', mcc: '5411', amount: 3.49 },
    { name: 'Сыр «Савушкин» 45%, 200 г', mcc: '5411', amount: 6.49 },
  ],
};

import type { ChildQuickAction } from '@/types/dashboard';

export const childQuickActions: ChildQuickAction[] = [
  { id: 'child-action-ask', label: 'Попросить деньги', icon: 'handshake', tone: 'primary' },
  { id: 'child-action-qr', label: 'Оплатить по QR', icon: 'qr-code-scanner', tone: 'accent' },
  { id: 'child-action-history', label: 'История', icon: 'receipt-long', tone: 'primary' },
];

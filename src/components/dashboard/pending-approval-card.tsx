import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import type { PendingPurchase } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type PendingApprovalCardProps = {
  purchase: PendingPurchase;
  onApprove: () => void;
  onDecline: () => void;
};

export function PendingApprovalCard({
  purchase,
  onApprove,
  onDecline,
}: PendingApprovalCardProps) {
  return (
    <Card
      className="gap-3 border-2 border-primary/30 p-4"
      style={{
        shadowColor: '#1D63ED',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}>
      <View className="flex-row items-center justify-between gap-2">
        <Badge label="Требует решения • Только что" tone="warning" dot />
        <Text className="text-[11px] font-inter-medium text-on-surface-variant">
          {purchase.scenario}
        </Text>
      </View>

      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-3">
          <IconTile icon="menu-book" tone="primary" size="md" />
          <View className="flex-1">
            <Text className="text-[15px] font-inter-bold leading-tight text-on-surface">
              {purchase.title}
            </Text>
            <View className="mt-0.5 flex-row flex-wrap items-center">
              <Text className="text-[12px] font-inter-medium text-on-surface-variant">
                {purchase.merchant} •
              </Text>
              <View className="ml-1 flex-row items-center gap-1">
                <Text className="text-[12px] font-inter-medium text-on-surface-variant">
                  {formatBYN(purchase.amount)}
                </Text>
                <BynIcon size={10} color="#64748B" />
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row items-end gap-1">
          <Text className="text-[17px] font-inter-bold text-primary">
            {formatBYN(purchase.amount)}
          </Text>
          <BynIcon size={12} color="#1D63ED" style={{ marginBottom: 4 }} />
        </View>
      </View>

      <View className="flex-row items-center gap-2 rounded-xl border border-outline-soft bg-slate-50 px-3 py-2">
        <Icon name="info-outline" size={16} color="#EF4444" />
        <View className="flex-1 flex-row flex-wrap items-center">
          <Text className="text-[12px] font-inter text-on-surface-variant">
            Превышен дневной лимит ({formatBYN(purchase.dailyLimit)}
          </Text>
          <BynIcon size={10} color="#64748B" style={{ marginLeft: 3 }} />
          <Text className="text-[12px] font-inter text-on-surface-variant">
            ). Доступно: {formatBYN(purchase.available)}
          </Text>
          <BynIcon size={10} color="#64748B" style={{ marginLeft: 3 }} />
        </View>
      </View>

      <View className="flex-row gap-2 pt-0.5">
        <Button
          label={`Одобрить (${purchase.amount} BYN)`}
          labelNode={
            <View className="flex-row items-center">
              <Text className="text-[13px] font-inter-semibold text-white">
                Одобрить ({purchase.amount}
              </Text>
              <BynIcon size={10} color="#FFFFFF" style={{ marginLeft: 3 }} />
              <Text className="text-[13px] font-inter-semibold text-white">)</Text>
            </View>
          }
          icon="check-circle"
          className="flex-1"
          onPress={onApprove}
        />
        <Button
          label="Отклонить"
          icon="close"
          variant="secondary"
          className="flex-1"
          onPress={onDecline}
        />
      </View>

      <View className="flex-row items-center justify-center gap-1.5">
        <Icon name="qr-code-scanner" size={13} color="#1D63ED" />
        <Text className="flex-1 text-center text-[11px] font-inter text-on-surface-variant">
          Демо-сценарий КРОК. Запрос отправлен в 1 клик через QR
        </Text>
      </View>
    </Card>
  );
}

import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { DecisionRequest } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type DecisionsSectionProps = {
  requests: DecisionRequest[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
};

export function DecisionsSection({ requests, onApprove, onDecline }: DecisionsSectionProps) {
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between px-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-headline-sm font-inter-semibold text-on-surface">
            Требует решения
          </Text>
          {requests.length > 0 ? (
            <Badge label={String(requests.length)} tone="secondary" dot />
          ) : null}
        </View>
        <Text className="text-label-sm font-inter-medium text-outline">Саша ожидает</Text>
      </View>

      {requests.length === 0 ? (
        <Card className="p-space-md">
          <Text className="text-center text-body-sm text-on-surface-variant">
            Все запросы обработаны
          </Text>
        </Card>
      ) : (
        <View className="gap-2.5">
          {requests.map((request) => (
            <DecisionCard
              key={request.id}
              request={request}
              onApprove={() => onApprove(request.id)}
              onDecline={() => onDecline(request.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type DecisionCardProps = {
  request: DecisionRequest;
  onApprove: () => void;
  onDecline: () => void;
};

function DecisionCard({ request, onApprove, onDecline }: DecisionCardProps) {
  const purchase = request.kind === 'purchase';

  return (
    <Card className="gap-2.5 p-space-md">
      <View className="flex-row items-start gap-2.5">
        <View
          className={`h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
            purchase ? 'bg-secondary-fixed/50' : 'bg-tertiary-fixed/50'
          }`}>
          <Icon name={request.icon} size={22} color={purchase ? '#994700' : '#006242'} />
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-label-lg font-inter-semibold text-on-surface">
              {request.title}
            </Text>
            <View className="flex-shrink-0 flex-row items-center gap-1 pt-0.5">
              <Text
                className={`text-label-lg font-inter-bold ${
                  purchase ? 'text-on-surface' : 'text-tertiary'
                }`}>
                {purchase ? formatBYN(request.amount) : `+${formatBYN(request.amount)}`}
              </Text>
              <BynIcon size={10} color={purchase ? '#191C1E' : '#006242'} />
            </View>
          </View>
          {purchase ? (
            <View className="flex-row flex-wrap items-center">
              <Text className="text-body-sm text-on-surface-variant">{request.subtitle} · </Text>
              <Text className="text-body-sm text-on-surface-variant">
                {formatBYN(request.amount)}
              </Text>
              <BynIcon size={9} color="#424655" style={{ marginLeft: 2 }} />
            </View>
          ) : (
            <Text className="text-body-sm text-on-surface-variant">{request.subtitle}</Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-2 rounded-lg bg-secondary-fixed/40 px-2.5 py-1.5">
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-1.5">
          <Icon
            name={purchase ? 'warning' : 'pending-actions'}
            size={16}
            color="#FB7800"
          />
          {request.noteAmount !== undefined ? (
            <View className="flex-row flex-wrap items-center">
              <Text className="text-label-sm font-inter-medium text-on-secondary-fixed">
                {request.note} (
              </Text>
              <Text className="text-label-sm font-inter-medium text-on-secondary-fixed">
                {formatBYN(request.noteAmount)}
              </Text>
              <BynIcon size={9} color="#321200" style={{ marginHorizontal: 2 }} />
              <Text className="text-label-sm font-inter-medium text-on-secondary-fixed">)</Text>
            </View>
          ) : (
            <Text className="text-label-sm font-inter-semibold text-on-secondary-fixed">
              {request.note}
            </Text>
          )}
        </View>
        {request.noteDetail ? (
          <Text className="flex-shrink-0 text-label-sm font-inter-medium text-on-secondary-fixed/80">
            {request.noteDetail}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-2">
        <Button
          label="Отклонить"
          variant="secondary"
          className="flex-1"
          onPress={onDecline}
        />
        {purchase ? (
          <Button
            label="Одобрить"
            variant="primary"
            className="flex-1"
            onPress={onApprove}
            labelNode={
              <View className="flex-row items-center">
                <Text className="text-label-md font-inter-semibold text-on-primary">
                  Одобрить ({formatBYN(request.amount)}
                </Text>
                <BynIcon size={9} color="#FFFFFF" style={{ marginHorizontal: 2 }} />
                <Text className="text-label-md font-inter-semibold text-on-primary">)</Text>
              </View>
            }
          />
        ) : (
          <Button
            label="Подтвердить"
            icon="check-circle"
            variant="primary"
            className="flex-1"
            onPress={onApprove}
          />
        )}
      </View>
    </Card>
  );
}

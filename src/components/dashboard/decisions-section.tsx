import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import type { DecisionRequest } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type DecisionsSectionProps = {
  requests: DecisionRequest[];
  childName: string;
  busyId?: string | null;
  onApprove: (request: DecisionRequest) => void;
  onDecline: (request: DecisionRequest) => void;
};

export function DecisionsSection({
  requests,
  childName,
  busyId,
  onApprove,
  onDecline,
}: DecisionsSectionProps) {
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between px-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-headline-sm font-inter-semibold text-on-surface">
            Требует решения
          </Text>
          {requests.length > 0 ? (
            <Badge label={String(requests.length)} tone="warning" dot />
          ) : null}
        </View>
        <Text className="text-label-sm font-inter-medium text-outline">{childName} ожидает</Text>
      </View>

      {requests.length === 0 ? (
        <Card className="p-space-md">
          <Text className="text-center text-body-sm font-inter text-on-surface-variant">
            Все запросы обработаны
          </Text>
        </Card>
      ) : (
        <View className="gap-2.5">
          {requests.map((request) => (
            <DecisionCard
              key={request.id}
              request={request}
              busy={request.id === busyId}
              onApprove={() => onApprove(request)}
              onDecline={() => onDecline(request)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type DecisionCardProps = {
  request: DecisionRequest;
  busy?: boolean;
  onApprove: () => void;
  onDecline: () => void;
};

function DecisionCard({ request, busy, onApprove, onDecline }: DecisionCardProps) {
  const purchase = request.kind === 'purchase';

  return (
    <Card className="gap-2.5 p-space-md">
      <View className="flex-row items-start gap-3">
        <IconTile icon={request.icon} tone={purchase ? 'secondary' : 'tertiary'} />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="min-w-0 flex-1 flex-row flex-wrap items-center">
              <Text className="text-label-lg font-inter-semibold leading-snug text-on-surface">
                {request.title}
              </Text>
              {purchase ? (
                <View className="flex-row items-center">
                  <Text className="text-label-lg font-inter-semibold leading-snug text-on-surface">
                    {' · '}
                  </Text>
                  <Text className="text-label-lg font-inter-semibold leading-snug text-on-surface">
                    {formatBYN(request.amount)}
                  </Text>
                  <BynIcon size={10} color="#191C1E" style={{ marginLeft: 2 }} />
                </View>
              ) : null}
            </View>
            {!purchase ? (
              <View className="flex-shrink-0 flex-row items-center gap-1 rounded-full bg-success-soft px-2 py-0.5">
                <Text className="text-label-sm font-inter-bold text-success">
                  +{formatBYN(request.amount)}
                </Text>
                <BynIcon size={9} color="#00B856" />
              </View>
            ) : null}
          </View>
          <Text className="pt-0.5 text-[13px] font-inter leading-[18px] text-on-surface-variant">
            {request.subtitle}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-2 rounded-lg border border-warning/25 bg-warning-soft px-2.5 py-1.5">
        <Icon
          name={purchase ? 'warning' : 'pending-actions'}
          size={purchase ? 18 : 16}
          color="#FF7A00"
        />
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center">
          <Text className="text-label-sm font-inter-medium text-secondary">{request.note}</Text>
          {request.noteAmount !== undefined ? (
            <>
              <Text className="text-label-sm font-inter-medium text-secondary"> (</Text>
              <Text className="text-label-sm font-inter-medium text-secondary">
                {formatBYN(request.noteAmount)}
              </Text>
              <BynIcon size={9} color="#994700" style={{ marginHorizontal: 2 }} />
              <Text className="text-label-sm font-inter-medium text-secondary">)</Text>
            </>
          ) : null}
          {request.available !== undefined ? (
            <>
              <Text className="text-label-sm font-inter-medium text-secondary">. Доступно: </Text>
              <Text className="text-label-sm font-inter-medium text-secondary">
                {formatBYN(request.available)}
              </Text>
              <BynIcon size={9} color="#994700" style={{ marginHorizontal: 2 }} />
            </>
          ) : null}
        </View>
        {request.noteDetail ? (
          <Text className="flex-shrink-0 text-label-sm font-inter-medium text-secondary/80">
            {request.noteDetail}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-2">
        <Button
          label="Отклонить"
          variant="secondary"
          className="flex-1 rounded-xl"
          disabled={busy}
          onPress={onDecline}
        />
        {purchase ? (
          <Button
            label="Одобрить"
            variant="primary"
            className="flex-1 rounded-xl"
            loading={busy}
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
            className="flex-1 rounded-xl"
            loading={busy}
            onPress={onApprove}
          />
        )}
      </View>

      {request.hint ? (
        <Text className="pt-0.5 text-center text-[11px] font-inter text-outline">{request.hint}</Text>
      ) : null}
    </Card>
  );
}

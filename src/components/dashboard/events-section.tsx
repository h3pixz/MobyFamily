import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import { PendingApprovalCard } from '@/components/dashboard/pending-approval-card';
import type { ActivityEvent, PendingPurchase } from '@/types/dashboard';
import { formatSignedBYN } from '@/utils/format';

const toneMap = {
  success: 'accent',
  neutral: 'neutral',
  primary: 'primary',
} as const;

type EventsSectionProps = {
  events: ActivityEvent[];
  approval: PendingPurchase | null;
  onApprove: () => void;
  onDecline: () => void;
  onPressHistory: () => void;
};

export function EventsSection({
  events,
  approval,
  onApprove,
  onDecline,
  onPressHistory,
}: EventsSectionProps) {
  return (
    <View className="gap-2 pt-1">
      <SectionHeader title="События Саши" actionLabel="Вся история" onAction={onPressHistory} />

      {approval ? (
        <PendingApprovalCard purchase={approval} onApprove={onApprove} onDecline={onDecline} />
      ) : null}

      <Card className="overflow-hidden">
        {events.map((event, index) => (
          <View key={event.id}>
            {index > 0 ? <View className="mx-3.5 h-px bg-track" /> : null}
            <View className="flex-row items-center justify-between gap-2 p-3.5">
              <View className="flex-1 flex-row items-center gap-3">
                <IconTile icon={event.icon} tone={toneMap[event.tone]} size="sm" />
                <View className="flex-1">
                  <Text className="text-[14px] font-inter-semibold text-on-surface">
                    {event.title}
                  </Text>
                  <Text className="text-[12px] font-inter text-on-surface-variant">
                    {event.subtitle}
                  </Text>
                </View>
              </View>

              {event.trailing.kind === 'money' ? (
                <Text
                  className={`text-[16px] font-inter-bold ${
                    event.trailing.amount > 0 ? 'text-accent' : 'text-on-surface'
                  }`}>
                  {formatSignedBYN(event.trailing.amount)} BYN
                </Text>
              ) : (
                <Badge label={`+${event.trailing.amount} баллов`} tone="accent" />
              )}
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}

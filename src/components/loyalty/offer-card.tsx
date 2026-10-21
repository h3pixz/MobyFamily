import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import type { PartnerOfferDto } from '@/api/gen/models/PartnerOfferDto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPoints } from '@/utils/format';

type OfferCardProps = {
  offer: PartnerOfferDto;
  balance: number;
  redeeming: boolean;
  onRedeem: () => void;
};

export function OfferCard({ offer, balance, redeeming, onRedeem }: OfferCardProps) {
  const affordable = balance >= offer.cost;

  return (
    <Card className="overflow-hidden">
      <Image
        source={{ uri: offer.imageUrl }}
        contentFit="cover"
        style={{ width: '100%', height: 120 }}
      />

      <View className="gap-2 p-4">
        <View className="flex-row items-start justify-between gap-2">
          <View className="min-w-0 flex-1">
            <Text className="text-label-sm font-inter-semibold uppercase tracking-wider text-outline">
              {offer.partnerName}
            </Text>
            <Text className="text-label-lg font-inter-semibold text-on-surface">
              {offer.title}
            </Text>
          </View>
          {offer.discountBadge ? <Badge label={offer.discountBadge} tone="warning" /> : null}
        </View>

        <Text className="text-body-sm font-inter text-on-surface-variant" numberOfLines={2}>
          {offer.description}
        </Text>

        <View className="flex-row items-center justify-between gap-2 pt-1">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-headline-sm font-inter-bold text-secondary">
              {formatPoints(offer.cost)}
            </Text>
            <Text className="text-label-sm font-inter-semibold text-on-surface-variant">
              Мобиков
            </Text>
          </View>

          <Button
            label={affordable ? 'Обменять' : 'Не хватает'}
            icon="redeem"
            size="sm"
            className="rounded-lg"
            loading={redeeming}
            disabled={!affordable || redeeming}
            onPress={onRedeem}
          />
        </View>
      </View>
    </Card>
  );
}

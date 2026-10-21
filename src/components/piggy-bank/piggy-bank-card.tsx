import { Pressable, Text, View } from 'react-native';

import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';
import { getGoalEmoji } from '@/utils/piggy-bank';

const STATUS_LABEL: Record<PiggyBankResponseDto['status'], string> = {
  ACTIVE: 'Активна',
  COMPLETED: 'Цель достигнута',
  BROKEN: 'Разбита',
};

type PiggyBankCardProps = {
  piggyBank: PiggyBankResponseDto;
  ownerName?: string;
  canManage: boolean;
  onTopUp: () => void;
  onEdit?: () => void;
  onWithdraw?: () => void;
  onDelete?: () => void;
};

export function PiggyBankCard({
  piggyBank,
  ownerName,
  canManage,
  onTopUp,
  onEdit,
  onWithdraw,
  onDelete,
}: PiggyBankCardProps) {
  const percent = Math.min(100, Math.max(0, piggyBank.progressPercentage));
  const active = piggyBank.status === 'ACTIVE';
  const description =
    typeof piggyBank.description === 'string' && piggyBank.description
      ? piggyBank.description
      : 'Копилка мечты';

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-surface-low">
          <Text className="text-xl">{getGoalEmoji(piggyBank.title)}</Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-headline-sm font-inter-semibold text-on-surface">
            {piggyBank.title}
          </Text>
          <Text numberOfLines={1} className="text-body-sm font-inter text-on-surface-variant">
            {ownerName ? `${ownerName} · ` : ''}
            {description}
          </Text>
        </View>

        <Badge
          label={STATUS_LABEL[piggyBank.status]}
          tone={piggyBank.status === 'COMPLETED' ? 'success' : active ? 'info' : 'neutral'}
        />
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-baseline justify-between gap-2">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-headline-md font-inter-bold text-on-surface">
              {formatBYN(piggyBank.currentAmount)}
            </Text>
            <BynIcon size={10} color="#191C1E" />
          </View>
          <Text className="text-label-md font-inter text-on-surface-variant">
            из {formatBYN(piggyBank.targetAmount)} · {percent}%
          </Text>
        </View>

        <View className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
          <View
            className="h-full rounded-full bg-primary-container"
            style={{ width: `${percent}%` }}
          />
        </View>
      </View>

      {active ? (
        <View className="flex-row gap-2">
          <Button
            label="Пополнить"
            icon="add"
            variant="soft"
            size="sm"
            className="flex-1"
            onPress={onTopUp}
          />
          {canManage && onWithdraw ? (
            <Button
              label="Забрать"
              icon="savings"
              variant="secondary"
              size="sm"
              className="flex-1"
              onPress={onWithdraw}
            />
          ) : null}
        </View>
      ) : null}

      {canManage && active ? (
        <View className="flex-row items-center justify-end gap-4 border-t border-outline-variant/20 pt-2">
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Изменить копилку"
              onPress={onEdit}
              className="flex-row items-center gap-1"
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
              <Icon name="edit" size={16} color="#1D63ED" />
              <Text className="text-label-sm font-inter-semibold text-primary">Изменить</Text>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Удалить копилку"
              onPress={onDelete}
              className="flex-row items-center gap-1"
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}>
              <Icon name="delete-outline" size={16} color="#BA1A1A" />
              <Text className="text-label-sm font-inter-semibold text-error">Удалить</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

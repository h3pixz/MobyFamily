import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

type CardControlsCardProps = {
  allowOnlinePurchases: boolean;
  allowCashWithdrawal: boolean;
  isBlocked: boolean;
  spentToday: number;
  dailyLimit: number;
  resetting: boolean;
  onChangeOnline: (value: boolean) => void;
  onChangeCash: (value: boolean) => void;
  onChangeBlocked: (value: boolean) => void;
  onResetSpent: () => void;
};

export function CardControlsCard({
  allowOnlinePurchases,
  allowCashWithdrawal,
  isBlocked,
  spentToday,
  dailyLimit,
  resetting,
  onChangeOnline,
  onChangeCash,
  onChangeBlocked,
  onResetSpent,
}: CardControlsCardProps) {
  return (
    <View className="gap-3.5 rounded-xl bg-surface-low p-4">
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-surface-container">
          <Icon name="tune" size={18} color="#424655" />
        </View>
        <Text className="text-label-lg font-inter-semibold text-on-surface">Параметры карты</Text>
      </View>

      <Checkbox
        checked={allowOnlinePurchases}
        onChange={onChangeOnline}
        accessibilityLabel="Разрешить онлайн-покупки"
        labelNode={
          <View className="flex-1">
            <Text className="text-label-md font-inter-semibold text-on-surface">
              Онлайн-покупки
            </Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              Оплата в интернете и приложениях
            </Text>
          </View>
        }
      />

      <Checkbox
        checked={allowCashWithdrawal}
        onChange={onChangeCash}
        accessibilityLabel="Разрешить снятие наличных"
        labelNode={
          <View className="flex-1">
            <Text className="text-label-md font-inter-semibold text-on-surface">
              Снятие наличных
            </Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              Банкоматы и кассы
            </Text>
          </View>
        }
      />

      <Checkbox
        checked={isBlocked}
        onChange={onChangeBlocked}
        accessibilityLabel="Заблокировать карту"
        labelNode={
          <View className="flex-1">
            <Text className="text-label-md font-inter-semibold text-error">Блокировка карты</Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              Все операции будут отклонены
            </Text>
          </View>
        }
      />

      <View className="gap-2 border-t border-outline-variant/30 pt-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-label-sm font-inter text-on-surface-variant">
            Потрачено сегодня
          </Text>
          <Text className="text-label-md font-inter-semibold text-on-surface">
            {formatBYN(spentToday)} из {formatBYN(dailyLimit)}
          </Text>
        </View>
        <Button
          label="Сбросить траты за сегодня"
          icon="restart-alt"
          variant="secondary"
          size="md"
          loading={resetting}
          onPress={onResetSpent}
        />
      </View>
    </View>
  );
}

import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { formatPhone } from '@/utils/phone';

type ChildContactCardProps = {
  phone: string;
  complete: boolean;
  onChangePhone: (value: string) => void;
};

export function ChildContactCard({ phone, complete, onChangePhone }: ChildContactCardProps) {
  return (
    <Card className="gap-4 p-5">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2.5">
          <IconTile icon="smartphone" tone="primary" size="sm" className="rounded-xl" />
          <View>
            <Text className="text-headline-sm font-inter-semibold text-on-surface">
              Контактные данные
            </Text>
            <Text className="text-label-sm font-inter text-on-surface-variant">Шаг 1 из 2</Text>
          </View>
        </View>
        <Icon name="verified-user" size={20} color="#C3C6D7" />
      </View>

      <Field
        label="Номер телефона ребёнка"
        placeholder="(__) ___-__-__"
        keyboardType="phone-pad"
        autoComplete="tel"
        maxLength={15}
        value={phone}
        onChangeText={(value) => onChangePhone(formatPhone(value))}
        prefix={
          <View className="flex-row items-center">
            <Text className="text-[16px] leading-none">🇧🇾</Text>
            <Text className="ml-1.5 text-label-md font-inter-semibold text-on-surface">+375</Text>
            <View className="mx-2 h-4 w-px bg-surface-highest" />
          </View>
        }
        trailing={
          complete ? <Icon name="check-circle" size={22} color="#007D55" /> : null
        }
      />

      <View className="flex-row items-start gap-2.5 rounded-xl bg-surface-low px-3 py-3">
        <Icon name="sms" size={18} color="#004BC3" />
        <Text className="flex-1 text-body-sm font-inter leading-tight text-on-surface-variant">
          Если у ребёнка уже есть сим-карта, на неё придёт SMS с одноразовым кодом подтверждения
          для входа в детский профиль.
        </Text>
      </View>
    </Card>
  );
}

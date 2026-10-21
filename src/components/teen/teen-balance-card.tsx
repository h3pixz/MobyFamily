import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BankCard } from '@/components/dashboard/bank-card';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

type TeenBalanceCardProps = {
  ageLabel: string;
  cardLast4: string;
  cardNumberMask?: string;
  balance: number;
  savings: number;
};

export function TeenBalanceCard({
  ageLabel,
  cardLast4,
  cardNumberMask,
  balance,
  savings,
}: TeenBalanceCardProps) {
  const [numberVisible, setNumberVisible] = useState(false);
  const shortNumber = `•• ${cardLast4}`;
  const fullNumber = cardNumberMask ?? shortNumber;

  return (
    <BankCard colors={['#1D63ED', '#0D5CE5']} padding={20}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1.5">
          <View className="h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Icon name="credit-card" size={17} color="#FFFFFF" />
          </View>
          <Text className="text-label-md font-inter-semibold text-white">Moby Junior</Text>
        </View>
        <View className="rounded-full border border-white/25 bg-white/20 px-2.5 py-1">
          <Text className="text-[11px] font-inter-semibold text-white">{ageLabel}</Text>
        </View>
      </View>

      <Text className="mt-1 text-[11px] font-inter-medium tracking-wider text-white/75">
        {numberVisible ? fullNumber : shortNumber}
      </Text>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 justify-between rounded-2xl border border-white/20 bg-white/15 p-3">
          <Text className="text-[11px] font-inter-medium text-white/80">Для покупок</Text>
          <View className="mt-2.5 flex-row items-center gap-1">
            <Text className="text-[20px] font-inter-bold leading-none tracking-tight text-white">
              {formatBYN(balance)}
            </Text>
            <BynIcon size={11} color="rgba(255,255,255,0.85)" />
          </View>
          <Text className="mt-1 text-[10px] font-inter-medium text-white/70">Можно потратить</Text>
        </View>

        <View className="flex-1 justify-between rounded-2xl border border-white/20 bg-white/15 p-3">
          <Text className="text-[11px] font-inter-medium text-white/80">В копилке</Text>
          <View className="mt-2.5 flex-row items-center gap-1">
            <Text className="text-[20px] font-inter-bold leading-none tracking-tight text-white">
              {formatBYN(savings)}
            </Text>
            <BynIcon size={11} color="rgba(255,255,255,0.85)" />
          </View>
          <Text className="mt-1 text-[10px] font-inter-medium text-white/70">Накоплено</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={numberVisible ? 'Скрыть номер карты' : 'Показать реквизиты карты'}
        accessibilityState={{ expanded: numberVisible }}
        onPress={() => setNumberVisible((visible) => !visible)}
        className="mt-3.5 flex-row items-center justify-between border-t border-white/15 pt-3"
        style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}>
        <View className="flex-row items-center gap-1.5">
          <Icon
            name={numberVisible ? 'visibility-off' : 'visibility'}
            size={15}
            color="rgba(255,255,255,0.8)"
          />
          <Text className="text-label-md font-inter-medium text-white/90">
            {numberVisible ? 'Скрыть реквизиты карты' : 'Реквизиты карты'}
          </Text>
        </View>
        <Icon
          name={numberVisible ? 'expand-less' : 'chevron-right'}
          size={18}
          color="rgba(255,255,255,0.8)"
        />
      </Pressable>
    </BankCard>
  );
}

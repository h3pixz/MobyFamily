import { Pressable, Text, View } from 'react-native';

import type { CardDto } from '@/api/gen/models/CardDto';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { formatBYN } from '@/utils/format';

type CardPickerProps = {
  cards: CardDto[];
  value: string | null;
  onChange: (cardId: string) => void;
  label?: string;
};

export function CardPicker({ cards, value, onChange, label = 'Карта' }: CardPickerProps) {
  return (
    <View className="gap-2">
      <Text className="text-label-md font-inter-semibold text-on-surface-variant">{label}</Text>

      {cards.length === 0 ? (
        <View className="rounded-xl bg-surface-low px-3 py-3">
          <Text className="text-body-sm font-inter text-on-surface-variant">Карта не найдена</Text>
        </View>
      ) : (
        cards.map((card) => {
          const selected = card.id === value;

          return (
            <Pressable
              key={card.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Карта ${card.cardNumberMask}`}
              onPress={() => onChange(card.id)}
              className={`flex-row items-center gap-3 rounded-xl border-2 px-3 py-3 ${
                selected ? 'border-primary-container bg-surface-lowest' : 'border-transparent bg-surface-low'
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary-fixed">
                <Icon name="credit-card" size={18} color="#004BC3" />
              </View>

              <View className="min-w-0 flex-1">
                <Text className="text-label-md font-inter-semibold text-on-surface">
                  •• {card.cardNumberMask.slice(-4)}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-label-sm font-inter text-on-surface-variant">
                    {formatBYN(card.balance)}
                  </Text>
                  <BynIcon size={9} color="#737686" />
                </View>
              </View>

              <Icon
                name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={selected ? '#1D63ED' : '#737686'}
              />
            </Pressable>
          );
        })
      )}
    </View>
  );
}

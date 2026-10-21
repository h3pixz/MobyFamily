import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { TeenActionTone, TeenQuickAction } from '@/types/dashboard';

const tones: Record<TeenActionTone, { container: string; color: string }> = {
  primary: { container: 'bg-primary-soft', color: '#1D63ED' },
  blue: { container: 'bg-primary-fixed', color: '#004BC3' },
  warning: { container: 'bg-warning-soft', color: '#FB7800' },
  tertiary: { container: 'bg-success-soft', color: '#006242' },
};

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type TeenQuickActionsProps = {
  actions: TeenQuickAction[];
  onPress: (action: TeenQuickAction) => void;
};

export function TeenQuickActions({ actions, onPress }: TeenQuickActionsProps) {
  const rows = [actions.slice(0, 2), actions.slice(2, 4)].filter((row) => row.length > 0);

  return (
    <View className="gap-2.5">
      {rows.map((row) => (
        <View key={row[0]?.id} className="flex-row gap-2.5">
          {row.map((action) => {
            const tone = tones[action.tone];

            return (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                accessibilityLabel={`${action.label}. ${action.subtitle}`}
                onPress={() => onPress(action)}
                className="min-h-[72px] flex-1 flex-row items-center gap-3 rounded-2xl border border-outline-variant/25 bg-surface-lowest p-3"
                style={({ pressed }) => [shadow, pressed ? { opacity: 0.85 } : undefined]}>
                <View
                  className={`h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${tone.container}`}>
                  <Icon name={action.icon} size={21} color={tone.color} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-body-md font-inter-bold leading-tight text-on-surface">
                    {action.label}
                  </Text>
                  <Text className="mt-0.5 text-[11px] font-inter-medium text-outline">
                    {action.subtitle}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

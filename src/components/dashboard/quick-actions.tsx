import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { ActionTone, QuickActionItem } from '@/types/dashboard';

const tones: Record<ActionTone, { background: string; color: string }> = {
  primary: { background: 'bg-primary-fixed', color: '#004BC3' },
  secondary: { background: 'bg-secondary-fixed/50', color: '#994700' },
  tertiary: { background: 'bg-tertiary-fixed/50', color: '#006242' },
};

type QuickActionsProps = {
  title: string;
  actions: QuickActionItem[];
  onPress: (label: string) => void;
};

export function QuickActions({ title, actions, onPress }: QuickActionsProps) {
  return (
    <View className="gap-2 pb-2">
      <Text className="text-body-md font-inter-bold text-on-surface">{title}</Text>
      <View className="flex-row gap-2.5">
        {actions.map((action) => {
          const tone = tones[action.tone];

          return (
            <Card key={action.id} className="flex-1">
              <Pressable
                accessibilityRole="button"
                onPress={() => onPress(action.label)}
                className="items-center justify-center gap-1.5 p-3"
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-xl ${tone.background}`}>
                  <Icon name={action.icon} size={22} color={tone.color} />
                </View>
                <Text className="text-center text-label-sm font-inter-semibold leading-tight text-on-surface-variant">
                  {action.label}
                </Text>
              </Pressable>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

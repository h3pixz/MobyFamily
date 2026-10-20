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
    <Card className="gap-space-sm p-space-md">
      <Text className="text-headline-sm font-inter-semibold text-on-surface">{title}</Text>
      <View className="flex-row gap-2">
        {actions.map((action) => {
          const tone = tones[action.tone];

          return (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              onPress={() => onPress(action.label)}
              className="flex-1 items-center justify-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-low p-3"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${tone.background}`}>
                <Icon name={action.icon} size={22} color={tone.color} />
              </View>
              <Text className="text-center text-label-sm font-inter-medium leading-tight text-on-surface">
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

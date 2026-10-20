import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { ChildActionTone, ChildQuickAction } from '@/types/dashboard';

const tones: Record<ChildActionTone, { container: string; color: string }> = {
  primary: { container: 'bg-primary-fixed', color: '#004BC3' },
  secondary: { container: 'bg-secondary-fixed/60', color: '#994700' },
  accent: { container: 'bg-white/20', color: '#FFFFFF' },
};

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

const accentShadow = {
  shadowColor: '#1D63ED',
  shadowOpacity: 0.4,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

type ChildQuickActionsProps = {
  actions: ChildQuickAction[];
  onPress: (label: string) => void;
};

export function ChildQuickActions({ actions, onPress }: ChildQuickActionsProps) {
  return (
    <View className="flex-row gap-gutter">
      {actions.map((action) => {
        const accent = action.tone === 'accent';
        const tone = tones[action.tone];

        return (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={() => onPress(action.label)}
            className={`min-h-[96px] flex-1 items-center justify-center gap-1.5 rounded-card p-space-sm ${
              accent ? 'bg-primary-container' : 'bg-surface-lowest'
            }`}
            style={({ pressed }) => [accent ? accentShadow : shadow, pressed ? { opacity: 0.85 } : undefined]}>
            <View
              className={`h-10 w-10 items-center justify-center rounded-full ${tone.container}`}>
              <Icon name={action.icon} size={20} color={tone.color} />
            </View>
            <Text
              className={`text-center text-label-sm font-inter-semibold leading-tight ${
                accent ? 'text-on-primary' : 'text-on-surface'
              }`}>
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import { IconTile } from '@/components/ui/icon-tile';
import type { IconName } from '@/types/icons';

type QuickAction = {
  id: string;
  label: string;
  icon: IconName;
  tone: 'primary' | 'outline' | 'solidPrimary';
};

const actions: QuickAction[] = [
  { id: 'transfer', label: 'Перевести', icon: 'send', tone: 'solidPrimary' },
  { id: 'limits', label: 'Лимиты', icon: 'tune', tone: 'outline' },
  { id: 'tasks', label: 'Задания', icon: 'checklist', tone: 'outline' },
  { id: 'add-child', label: '+ Ребёнок', icon: 'person-add', tone: 'primary' },
];

type QuickActionsProps = {
  onPress: (label: string) => void;
};

export function QuickActions({ onPress }: QuickActionsProps) {
  return (
    <View className="flex-row gap-2 pt-1">
      {actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          onPress={() => onPress(action.label)}
          className="flex-1 items-center gap-1.5 p-1"
          style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}>
          <IconTile icon={action.icon} tone={action.tone} size="lg" />
          <Text className="text-center text-[11px] font-inter-medium leading-tight text-on-surface">
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

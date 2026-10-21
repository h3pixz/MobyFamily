import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

export type TasksTabKey = 'home' | 'tasks' | 'piggy' | 'profile';

type TasksTab = {
  key: TasksTabKey;
  label: string;
  icon: IconName;
};

const tabs: TasksTab[] = [
  { key: 'home', label: 'Главная', icon: 'home' },
  { key: 'tasks', label: 'Задания', icon: 'task-alt' },
  { key: 'piggy', label: 'Копилка', icon: 'savings' },
  { key: 'profile', label: 'Профиль', icon: 'person' },
];

type TasksBottomNavProps = {
  onPress: (tab: TasksTab) => void;
};

export function TasksBottomNav({ onPress }: TasksBottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-outline-variant/25 bg-surface-lowest"
      style={{
        paddingBottom: insets.bottom,
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -1 },
        elevation: 8,
      }}>
      <View className="h-16 flex-row items-center justify-around px-gutter">
        {tabs.map((tab) => {
          const active = tab.key === 'tasks';

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => onPress(tab)}
              className="h-14 min-w-[56px] items-center justify-center gap-0.5">
              <Icon name={tab.icon} size={24} color={active ? '#1D63ED' : '#737686'} />
              <Text
                className={`text-[11px] leading-tight ${
                  active
                    ? 'font-inter-semibold text-primary-container'
                    : 'font-inter-medium text-outline'
                }`}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

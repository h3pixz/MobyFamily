import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

export type TabKey = 'family' | 'limits' | 'savings' | 'profile';

type Tab = {
  key: TabKey;
  label: string;
  icon: IconName;
};

const tabs: Tab[] = [
  { key: 'family', label: 'Семья', icon: 'group' },
  { key: 'limits', label: 'Лимиты', icon: 'rule' },
  { key: 'savings', label: 'Копилка', icon: 'savings' },
  { key: 'profile', label: 'Профиль', icon: 'person-outline' },
];

type BottomNavProps = {
  activeTab: TabKey;
  onPress: (tab: Tab) => void;
};

export function BottomNav({ activeTab, onPress }: BottomNavProps) {
  return (
    <View className="h-16 flex-row items-center justify-around border-t border-outline-soft bg-card px-2">
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onPress(tab)}
            className="min-h-[44px] min-w-[64px] items-center justify-center gap-1">
            <Icon name={tab.icon} size={24} color={active ? '#1D63ED' : '#64748B'} />
            <Text
              className={`text-[11px] ${
                active ? 'font-inter-semibold text-primary' : 'font-inter-medium text-on-surface-variant'
              }`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

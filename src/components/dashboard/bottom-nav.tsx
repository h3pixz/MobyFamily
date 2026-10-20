import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

export type TabKey = 'family' | 'rules' | 'savings' | 'profile';

type Tab = {
  key: TabKey;
  label: string;
  icon: IconName;
};

const tabs: Tab[] = [
  { key: 'family', label: 'Семья', icon: 'family-restroom' },
  { key: 'rules', label: 'Правила', icon: 'tune' },
  { key: 'savings', label: 'Копилка', icon: 'savings' },
  { key: 'profile', label: 'Профиль', icon: 'person' },
];

type BottomNavProps = {
  activeTab: TabKey;
  onPress: (tab: Tab) => void;
};

export function BottomNav({ activeTab, onPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-surface-lowest"
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
          const active = tab.key === activeTab;

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
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

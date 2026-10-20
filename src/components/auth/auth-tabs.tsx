import { Pressable, Text, View } from 'react-native';

import type { AuthTab } from '@/types/auth';

const tabs: { key: AuthTab; label: string }[] = [
  { key: 'login', label: 'Вход' },
  { key: 'register', label: 'Регистрация' },
];

type AuthTabsProps = {
  activeTab: AuthTab;
  onChange: (tab: AuthTab) => void;
};

export function AuthTabs({ activeTab, onChange }: AuthTabsProps) {
  return (
    <View
      accessibilityRole="tablist"
      className="mx-4 mb-4 flex-row items-center gap-1 rounded-2xl bg-surface-high p-1">
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            className={`flex-1 items-center justify-center rounded-xl py-2 ${
              active ? 'bg-primary-container' : ''
            }`}
            style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}>
            <Text
              className={`text-label-lg font-inter-semibold ${
                active ? 'text-on-primary' : 'text-on-surface-variant'
              }`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

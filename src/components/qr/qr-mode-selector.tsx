import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { QrMode, QrModeId } from '@/types/qr';

type QrModeSelectorProps = {
  modes: QrMode[];
  activeId: QrModeId;
  onChange: (id: QrModeId) => void;
};

export function QrModeSelector({ modes, activeId, onChange }: QrModeSelectorProps) {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-white/10 p-1">
      {modes.map((mode) => {
        const active = mode.id === activeId;

        return (
          <Pressable
            key={mode.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(mode.id)}
            className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
              active ? 'bg-primary-container' : ''
            }`}
            style={({ pressed }) => (pressed && !active ? { opacity: 0.7 } : undefined)}>
            {mode.id === 'payment' ? (
              <Icon name="qr-code-scanner" size={14} color={active ? '#FFFFFF' : 'rgba(240,241,243,0.7)'} />
            ) : null}
            <Text
              className={`text-label-sm font-inter-semibold ${
                active ? 'text-on-primary' : 'text-inverse-on-surface/70'
              }`}>
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

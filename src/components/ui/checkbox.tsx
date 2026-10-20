import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelNode: ReactNode;
  error?: string;
  accessibilityLabel?: string;
};

export function Checkbox({
  checked,
  onChange,
  labelNode,
  error,
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <View className="gap-1.5">
      <View className="flex-row items-start gap-2.5">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ checked }}
          onPress={() => onChange(!checked)}
          hitSlop={12}
          className={`mt-0.5 h-5 w-5 items-center justify-center rounded-lg ${
            checked ? 'bg-primary-container' : 'bg-surface-high'
          }`}>
          {checked ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
        </Pressable>

        <View className="flex-1">{labelNode}</View>
      </View>

      {error ? (
        <View className="flex-row items-center gap-1.5 pl-7">
          <Icon name="error-outline" size={14} color="#BA1A1A" />
          <Text className="flex-1 text-label-sm font-inter text-error">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

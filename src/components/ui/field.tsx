import type { ReactNode } from 'react';
import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type FieldProps = Omit<TextInputProps, 'className'> & {
  label: string;
  labelAccessory?: ReactNode;
  icon?: IconName;
  prefix?: ReactNode;
  trailing?: ReactNode;
  hint?: string;
  error?: string;
  className?: string;
};

export function Field({
  label,
  labelAccessory,
  icon,
  prefix,
  trailing,
  hint,
  error,
  className = '',
  onFocus,
  onBlur,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const message = error ?? hint;

  return (
    <View className={`gap-1.5 ${className}`}>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-label-md font-inter-semibold text-on-surface-variant">{label}</Text>
        {labelAccessory}
      </View>

      <View
        className={`min-h-[48px] flex-row items-center rounded-xl border-2 px-3 ${
          focused ? 'border-primary-container bg-surface-lowest' : 'border-transparent bg-surface-low'
        }`}>
        {icon ? (
          <Icon name={icon} size={20} color={focused ? '#1D63ED' : '#737686'} />
        ) : null}
        {prefix}
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor="#737686"
          className={`min-w-0 flex-1 py-3 text-body-md font-inter text-on-surface ${
            icon ? 'ml-2' : ''
          }`}
        />
        {trailing}
      </View>

      {message ? (
        <View className="flex-row items-center gap-1.5 pt-0.5">
          <Icon
            name={error ? 'error-outline' : 'info'}
            size={14}
            color={error ? '#BA1A1A' : '#737686'}
          />
          <Text
            className={`flex-1 text-label-sm font-inter ${
              error ? 'text-error' : 'text-on-surface-variant'
            }`}>
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

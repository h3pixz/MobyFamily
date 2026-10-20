import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const variants: Record<ButtonVariant, { container: string; text: string; color: string }> = {
  primary: {
    container: 'bg-primary-container',
    text: 'text-on-primary',
    color: '#FFFFFF',
  },
  secondary: {
    container: 'border border-outline-variant/40 bg-surface-lowest',
    text: 'text-on-surface-variant',
    color: '#424655',
  },
  soft: {
    container: 'border border-outline-variant/40 bg-surface-low',
    text: 'text-primary',
    color: '#004BC3',
  },
  warning: {
    container: 'bg-secondary-container',
    text: 'text-on-secondary',
    color: '#FFFFFF',
  },
};

const sizes: Record<ButtonSize, { container: string; text: string; icon: number }> = {
  sm: { container: 'h-9 gap-1 rounded-lg px-3', text: 'text-label-sm', icon: 16 },
  md: { container: 'h-10 gap-1.5 rounded-lg px-3', text: 'text-label-md', icon: 18 },
  lg: { container: 'h-12 gap-2 rounded-2xl px-4', text: 'text-label-lg', icon: 18 },
  xl: { container: 'h-14 gap-2 rounded-2xl px-4', text: 'text-headline-sm', icon: 20 },
};

type ButtonProps = {
  label: string;
  labelNode?: ReactNode;
  icon?: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function Button({
  label,
  labelNode,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onPress,
}: ButtonProps) {
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      className={`flex-row items-center justify-center ${variantStyle.container} ${sizeStyle.container} ${
        disabled ? 'opacity-60' : ''
      } ${className}`}
      style={({ pressed }) => (pressed && !inactive ? { opacity: 0.85 } : undefined)}>
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.color} />
      ) : icon ? (
        <Icon name={icon} size={sizeStyle.icon} color={variantStyle.color} />
      ) : null}
      {labelNode ?? (
        <Text className={`font-inter-semibold ${variantStyle.text} ${sizeStyle.text}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

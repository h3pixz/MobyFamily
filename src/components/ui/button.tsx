import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'card' | 'warning';
type ButtonSize = 'sm' | 'md';

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
  card: {
    container: 'bg-surface-lowest',
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
};

type ButtonProps = {
  label: string;
  labelNode?: ReactNode;
  icon?: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onPress?: () => void;
};

export function Button({
  label,
  labelNode,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  onPress,
}: ButtonProps) {
  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center justify-center ${variantStyle.container} ${sizeStyle.container} ${className}`}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
      {icon ? <Icon name={icon} size={sizeStyle.icon} color={variantStyle.color} /> : null}
      {labelNode ?? (
        <Text className={`font-inter-semibold ${variantStyle.text} ${sizeStyle.text}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

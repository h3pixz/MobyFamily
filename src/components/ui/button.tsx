import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type ButtonVariant = 'primary' | 'secondary' | 'accent';
type ButtonSize = 'sm' | 'md';

const variants: Record<ButtonVariant, { container: string; text: string; color: string }> = {
  primary: { container: 'bg-primary', text: 'text-white', color: '#FFFFFF' },
  secondary: {
    container: 'bg-card border border-outline-soft',
    text: 'text-on-surface-variant',
    color: '#64748B',
  },
  accent: { container: 'bg-warning', text: 'text-white', color: '#FFFFFF' },
};

const sizes: Record<ButtonSize, { container: string; text: string; icon: number }> = {
  sm: { container: 'gap-1 rounded-lg px-3 py-1.5', text: 'text-[12px]', icon: 15 },
  md: { container: 'gap-1.5 rounded-xl px-3 py-2.5', text: 'text-[13px]', icon: 18 },
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

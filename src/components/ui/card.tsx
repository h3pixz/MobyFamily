import { View, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className = '', ...props }: CardProps) {
  return <View className={`rounded-2xl border border-outline-soft bg-card ${className}`} {...props} />;
}

import { View, type ViewProps } from 'react-native';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`rounded-card bg-surface-lowest ${className}`}
      style={[shadow, style]}
      {...props}
    />
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type BankCardProps = {
  colors: [string, string];
  children: ReactNode;
};

export function BankCard({ colors, children }: BankCardProps) {
  return (
    <View
      className="rounded-card"
      style={{
        shadowColor: '#1D63ED',
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, overflow: 'hidden', padding: 16 }}>
        <View className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <View className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />
        {children}
      </LinearGradient>
    </View>
  );
}

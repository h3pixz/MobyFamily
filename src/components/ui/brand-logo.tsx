import { Image } from 'expo-image';
import { View } from 'react-native';

const logo = require('../../../assets/images/logo-moby-family.png');

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 40, className = '' }: BrandLogoProps) {
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-xl bg-surface-lowest ${className}`}
      style={[{ width: size, height: size }, shadow]}>
      <Image source={logo} contentFit="contain" style={{ width: size - 6, height: size - 6 }} />
    </View>
  );
}

import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

const bynIcon = require('../../../assets/images/byn-icon.png');

type BynIconProps = {
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
};

export function BynIcon({ size = 10, color = '#141B2B', style }: BynIconProps) {
  return (
    <Image
      source={bynIcon}
      tintColor={color}
      contentFit="contain"
      style={[{ width: Math.round((size * 647) / 800), height: size }, style]}
    />
  );
}

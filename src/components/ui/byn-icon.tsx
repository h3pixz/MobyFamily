import { Image } from 'expo-image';

const bynIcon = require('../../../assets/images/byn-icon.png');

type BynIconProps = {
  size?: number;
  color?: string;
};

export function BynIcon({ size = 10, color = '#141B2B' }: BynIconProps) {
  return (
    <Image
      source={bynIcon}
      tintColor={color}
      contentFit="contain"
      style={{ width: Math.round((size * 647) / 800), height: size }}
    />
  );
}

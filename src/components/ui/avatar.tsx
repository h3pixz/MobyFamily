import { Image } from 'expo-image';

type AvatarProps = {
  uri: string;
  size: number;
  rounded?: 'xl' | 'full';
  label?: string;
};

export function Avatar({ uri, size, rounded = 'full', label }: AvatarProps) {
  return (
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: rounded === 'full' ? size / 2 : 12,
      }}
      contentFit="cover"
      transition={120}
      accessibilityLabel={label}
    />
  );
}

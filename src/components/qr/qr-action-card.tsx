import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/types/icons';

type QrActionTone = 'primary' | 'secondary';

const tones: Record<QrActionTone, { container: string; color: string }> = {
  primary: { container: 'bg-primary-fixed', color: '#004BC3' },
  secondary: { container: 'bg-secondary-fixed', color: '#994700' },
};

type QrActionCardProps = {
  icon: IconName;
  title: string;
  subtitle: string;
  tone: QrActionTone;
  loading?: boolean;
  onPress: () => void;
};

export function QrActionCard({
  icon,
  title,
  subtitle,
  tone,
  loading = false,
  onPress,
}: QrActionCardProps) {
  const { container, color } = tones[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ busy: loading }}
      disabled={loading}
      onPress={onPress}
      className="w-full"
      style={({ pressed }) => (pressed || loading ? { opacity: 0.8 } : undefined)}>
      <Card className="gap-3 p-space-md">
        <View className={`h-10 w-10 items-center justify-center rounded-xl ${container}`}>
          {loading ? (
            <ActivityIndicator size="small" color={color} />
          ) : (
            <Icon name={icon} size={22} color={color} />
          )}
        </View>
        <View>
          <Text className="text-headline-sm font-inter-semibold text-on-surface">{title}</Text>
          <Text className="mt-0.5 text-body-sm font-inter text-on-surface-variant">{subtitle}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

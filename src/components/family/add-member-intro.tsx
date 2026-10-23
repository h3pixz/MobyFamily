import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export function AddMemberIntro() {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary-fixed px-3 py-1">
        <Icon name="family-restroom" size={16} color="#004BC3" />
        <Text className="text-label-sm font-inter-semibold tracking-wide text-primary">
          MOBY JUNIOR • МТбанк
        </Text>
      </View>
      <Text className="text-display-mobile font-inter-bold tracking-tight text-on-surface">
        Добавить ребёнка
      </Text>

      <Text className="text-body-md font-inter leading-relaxed text-on-surface-variant">
        Привяжите карту или создайте детский профиль Moby Junior под родительским контролем.
      </Text>
    </View>
  );
}

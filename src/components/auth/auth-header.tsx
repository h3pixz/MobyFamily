import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

const shadow = {
  shadowColor: '#1D63ED',
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

export function AuthHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View className="flex-row items-center gap-2">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl bg-primary-container"
          style={shadow}>
          <Icon name="diversity-3" size={24} color="#FFFFFF" />
        </View>

        <View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-headline-sm font-inter-semibold tracking-tight text-on-surface">
              Moby
            </Text>
            <View className="rounded-full bg-primary-fixed px-1.5 py-0.5">
              <Text className="text-label-md font-inter-bold text-primary">Family</Text>
            </View>
          </View>
          <Text className="text-label-sm font-inter-medium uppercase tracking-wider text-on-surface-variant">
            МТБанк
          </Text>
        </View>
      </View>
    </View>
  );
}

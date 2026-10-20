import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import type { ChildProfile } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type ChildBalanceCardProps = {
  child: ChildProfile;
};

export function ChildBalanceCard({ child }: ChildBalanceCardProps) {
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
        colors={['#1D63ED', '#2B73FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, overflow: 'hidden', padding: 20 }}>
        <View className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <View className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10" />

        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                <Icon name="credit-card" size={18} color="#FFFFFF" />
              </View>
              <Text className="text-label-md font-inter-medium tracking-wide text-white">
                Moby Junior
              </Text>
            </View>
            <Text className="text-label-md font-inter-medium tracking-widest text-white/80">
              •• {child.cardLast4}
            </Text>
          </View>

          <View className="gap-1">
            <Text className="text-label-sm font-inter-semibold uppercase tracking-wider text-white/80">
              Можно потратить
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[32px] font-inter-extrabold leading-9 tracking-tight text-white">
                {formatBYN(child.purchaseBalance)}
              </Text>
              <BynIcon size={14} color="#FFFFFF" style={{ marginTop: 4 }} />
            </View>
            <View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
              <Icon name="timelapse" size={15} color="rgba(255,255,255,0.8)" />
              <Text className="text-body-sm font-inter-medium text-white/90">Дневной лимит:</Text>
              <Text className="text-body-sm font-inter-medium text-white/90">
                {formatBYN(child.dailyLimit)}
              </Text>
              <BynIcon size={9} color="rgba(255,255,255,0.9)" />
            </View>
          </View>

          <View className="-mx-5 -mb-5 flex-row flex-wrap items-center gap-1.5 bg-black/15 px-5 py-2">
            <Icon name="event-available" size={16} color="#6FFBBE" />
            <Text className="text-body-sm font-inter text-white/90">Следующие карманные</Text>
            <Text className="text-body-sm font-inter-semibold text-white">
              {formatBYN(child.pocketMoney)}
            </Text>
            <BynIcon size={9} color="#FFFFFF" />
            <Text className="text-body-sm font-inter text-white/90">{child.pocketMoneySchedule}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

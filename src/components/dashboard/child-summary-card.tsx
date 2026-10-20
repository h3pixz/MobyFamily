import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { ChildProfile } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type ChildSummaryCardProps = {
  child: ChildProfile;
};

export function ChildSummaryCard({ child }: ChildSummaryCardProps) {
  const limitProgress = child.dailyLimit > 0 ? child.dailySpent / child.dailyLimit : 0;

  return (
    <View
      className="rounded-2xl"
      style={{
        backgroundColor: '#1D63ED',
        shadowColor: '#1D63ED',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}>
      <LinearGradient
        colors={['#1D63ED', '#2B73FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, overflow: 'hidden', padding: 16 }}>
        <View className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
        <View className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20" />

        <View className="gap-3.5">
          <View className="flex-row flex-wrap items-start justify-between gap-2">
            <View className="flex-1 min-w-[130px]">
              <View className="flex-row items-center gap-1.5">
                <Text
                  className="text-[17px] font-inter-bold tracking-tight text-white"
                  numberOfLines={1}>
                  {child.name}, {child.age} лет
                </Text>
                <Icon name="verified-user" size={16} color="#FFFFFF" />
              </View>
              <Text className="text-[12px] font-inter-medium text-white/80">
                Детская карта •• {child.cardLast4}
              </Text>
            </View>
            <Badge label={child.ageGroup} tone="glass" icon="shield" className="ml-auto shrink-0" />
          </View>

          <View className="flex-row gap-2.5">
            <View className="flex-1 justify-between rounded-xl border border-white/15 bg-white/15 p-3">
              <View className="flex-row items-center gap-1.5">
                <Icon name="credit-card" size={16} color="rgba(255,255,255,0.8)" />
                <Text className="text-[12px] font-inter-medium text-white/80">Для покупок</Text>
              </View>
              <View className="mt-2">
                <View className="flex-row items-end gap-1">
                  <Text className="text-[26px] font-inter-bold leading-none tracking-tight text-white">
                    {formatBYN(child.purchaseBalance)}
                  </Text>
                  <BynIcon
                    size={10}
                    color="rgba(255,255,255,0.9)"
                    style={{ marginBottom: 6 }}
                  />
                </View>
                <View className="mt-2 flex-row items-center gap-1.5">
                  <View className="h-1.5 w-1.5 rounded-full border border-white/20 bg-accent" />
                  <Text className="text-[11px] font-inter-medium text-white/90">Активна</Text>
                </View>
              </View>
            </View>

            <View className="flex-1 justify-between rounded-xl border border-white/15 bg-white/15 p-3">
              <View className="flex-row items-center gap-1.5">
                <Icon name="savings" size={16} color="rgba(255,255,255,0.8)" />
                <Text className="text-[12px] font-inter-medium text-white/80">В копилке</Text>
              </View>
              <View className="mt-2">
                <View className="flex-row items-end gap-1">
                  <Text className="text-[26px] font-inter-bold leading-none tracking-tight text-white">
                    {formatBYN(child.savingsBalance)}
                  </Text>
                  <BynIcon
                    size={10}
                    color="rgba(255,255,255,0.9)"
                    style={{ marginBottom: 6 }}
                  />
                </View>
                <Text className="mt-2 text-[11px] font-inter-medium text-white/85">
                  {child.activeGoals} активная цель
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-2">
            <View className="gap-1.5 rounded-xl border border-white/10 bg-white/15 px-3 py-2.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Icon name="speed" size={15} color="rgba(255,255,255,0.85)" />
                  <Text className="text-[12px] font-inter-medium text-white/85">
                    Дневной лимит:
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[12px] font-inter-bold text-white">
                    {formatBYN(child.dailySpent)} из {formatBYN(child.dailyLimit)}
                  </Text>
                  <BynIcon size={10} color="#FFFFFF" />
                </View>
              </View>
              <ProgressBar
                value={limitProgress}
                trackClassName="bg-white/25"
                barClassName="bg-white"
                heightClassName="h-1.5"
              />
            </View>

            <View className="flex-row items-center justify-between rounded-xl border border-white/10 bg-white/15 px-3 py-2">
              <View className="flex-1 flex-row items-center gap-2">
                <Icon name="event-repeat" size={17} color="rgba(255,255,255,0.9)" />
                <View className="flex-row flex-wrap items-center gap-1">
                  <Text className="text-[12px] font-inter text-white/90">Карманные:</Text>
                  <Text className="text-[12px] font-inter-semibold text-white">
                    {child.pocketMoney}
                  </Text>
                  <BynIcon size={10} color="#FFFFFF" />
                  <Text className="text-[12px] font-inter text-white/90">в неделю</Text>
                </View>
              </View>
              <View className="rounded-md bg-white/10 px-2 py-0.5">
                <Text className="text-[11px] font-inter-medium text-white/80">
                  ({child.pocketMoneySchedule})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

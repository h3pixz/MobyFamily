import { Text, View } from 'react-native';

import { TopUpCard } from '@/components/history/top-up-card';
import { TopUpHistoryEmpty } from '@/components/history/top-up-history-empty';
import type { TopUpDayGroup } from '@/types/history';
import { pluralize } from '@/utils/format';

type TopUpHistoryProps = {
  groups: TopUpDayGroup[];
};

export function TopUpHistory({ groups }: TopUpHistoryProps) {
  if (groups.length === 0) {
    return <TopUpHistoryEmpty />;
  }

  return (
    <View className="gap-4">
      {groups.map((group) => {
        const count = group.entries.length;
        const countLabel = pluralize(count, ['операция', 'операции', 'операций']);

        return (
          <View key={group.key} className="gap-2">
            <View className="flex-row items-center justify-between gap-2 px-1">
              <Text className="flex-1 text-label-md font-inter-semibold uppercase tracking-wider text-on-surface-variant">
                {group.label}
              </Text>
              <Text className="text-label-sm font-inter text-outline">
                {count} {countLabel}
              </Text>
            </View>

            <View className="gap-2">
              {group.entries.map((entry) => (
                <TopUpCard key={entry.id} entry={entry} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import type { Task } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type TasksSectionProps = {
  tasks: Task[];
  onNewTask: () => void;
};

export function TasksSection({ tasks, onNewTask }: TasksSectionProps) {
  return (
    <Card className="gap-space-sm p-space-md">
      <SectionHeader
        title="Задания Саши"
        badge={`${tasks.length} в процессе`}
        actionLabel="+ Новое задание"
        onAction={onNewTask}
      />

      {tasks.length === 0 ? (
        <Text className="py-2 text-center text-body-sm text-on-surface-variant">
          Активных заданий нет
        </Text>
      ) : (
        tasks.map((task) => <TaskRow key={task.id} task={task} />)
      )}
    </Card>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <View className="gap-2 rounded-xl border border-outline-variant/30 bg-surface-low p-3">
      <View className="flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          <IconTile icon={task.icon} tone="primary" size="sm" />
          <View className="min-w-0 flex-1">
            <Text className="text-label-lg font-inter-semibold text-on-surface" numberOfLines={1}>
              {task.title}
            </Text>
            <Text className="text-body-sm text-outline">{task.subtitle}</Text>
          </View>
        </View>
        {task.reward.kind === 'points' ? (
          <Badge label={`+${task.reward.amount} баллов`} tone="tertiary" />
        ) : (
          <View className="flex-shrink-0 flex-row items-center gap-1">
            <Text className="text-label-lg font-inter-bold text-tertiary">
              +{formatBYN(task.reward.amount)}
            </Text>
            <BynIcon size={10} color="#006242" />
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between border-t border-outline-variant/30 pt-1.5">
        <Badge label="В процессе" tone="neutral" />
        <View className="flex-row items-center gap-1">
          <Icon name="notifications-active" size={14} color="#737686" />
          <Text className="text-body-sm text-outline">Напоминание отправлено</Text>
        </View>
      </View>
    </View>
  );
}

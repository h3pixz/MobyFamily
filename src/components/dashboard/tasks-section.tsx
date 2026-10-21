import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import type { Task } from '@/types/dashboard';
import { getGenitiveName } from '@/utils/family';
import { formatBYN } from '@/utils/format';

type TasksSectionProps = {
  tasks: Task[];
  childName: string;
  onNewTask: () => void;
};

export function TasksSection({ tasks, childName, onNewTask }: TasksSectionProps) {
  return (
    <Card className="gap-space-sm p-space-md">
      <SectionHeader
        title={childName ? `Задания ${getGenitiveName(childName)}` : 'Задания'}
        actionLabel="+ Новое задание"
        onAction={onNewTask}
      />

      {tasks.length === 0 ? (
        <Text className="py-2 text-center text-body-sm font-inter text-on-surface-variant">
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
    <View className="gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-low/70 p-3">
      <View className="flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-start gap-2.5">
          <IconTile icon={task.icon} tone="primary" size="sm" className="mt-0.5" />
          <View className="min-w-0 flex-1">
            <Text className="text-label-lg font-inter-semibold text-on-surface" numberOfLines={1}>
              {task.title}
            </Text>
            <Text className="text-[13px] font-inter leading-[18px] text-outline">{task.subtitle}</Text>
          </View>
        </View>
        {task.reward.kind === 'points' ? (
          <View className="flex-shrink-0 rounded-full bg-success-soft px-2 py-0.5">
            <Text className="text-label-sm font-inter-bold text-success">
              +{task.reward.amount} баллов
            </Text>
          </View>
        ) : (
          <View className="flex-shrink-0 flex-row items-center gap-1 rounded-full bg-success-soft px-2 py-0.5">
            <Text className="text-label-sm font-inter-bold text-success">
              +{formatBYN(task.reward.amount)}
            </Text>
            <BynIcon size={9} color="#00B856" />
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-outline-variant/20 pt-1.5">
        <Badge
          label={
            task.status === 'submitted'
              ? 'На проверке'
              : task.status === 'in_progress'
                ? 'В процессе'
                : 'Ожидает'
          }
          tone={task.status === 'submitted' ? 'warning' : task.status === 'in_progress' ? 'info' : 'neutral'}
        />
        <View className="flex-row items-center gap-1">
          <Icon
            name={task.status === 'submitted' ? 'hourglass-top' : 'schedule'}
            size={14}
            color="#737686"
          />
          <Text className="text-[12px] font-inter text-outline">
            {task.status === 'submitted' ? 'Родитель проверит отчёт' : 'Задание активно'}
          </Text>
        </View>
      </View>
    </View>
  );
}

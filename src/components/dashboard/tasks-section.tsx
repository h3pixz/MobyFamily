import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import type { Task } from '@/types/dashboard';
import { formatBYN } from '@/utils/format';

type TasksSectionProps = {
  tasks: Task[];
  onConfirm: (id: string) => void;
  onDecline: (id: string) => void;
  onNewTask: () => void;
};

export function TasksSection({ tasks, onConfirm, onDecline, onNewTask }: TasksSectionProps) {
  const badge = tasks.length === 1 ? '1 активное' : `${tasks.length} активных`;

  return (
    <View className="gap-2.5 pt-1">
      <SectionHeader title="Задания Саши" badge={badge} actionLabel="+ Новое задание" onAction={onNewTask} />
      <View className="gap-2.5">
        {tasks.length === 0 ? (
          <Card className="items-center p-4">
            <Text className="text-[12px] font-inter text-on-surface-variant">
              Активных заданий нет
            </Text>
          </Card>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onConfirm={() => onConfirm(task.id)}
              onDecline={() => onDecline(task.id)}
            />
          ))
        )}
      </View>
    </View>
  );
}

type TaskCardProps = {
  task: Task;
  onConfirm: () => void;
  onDecline: () => void;
};

function TaskCard({ task, onConfirm, onDecline }: TaskCardProps) {
  const isMoney = task.reward.kind === 'money';

  return (
    <Card className="gap-2.5 p-3.5">
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-2.5">
          <IconTile icon={task.icon} tone={isMoney ? 'amber' : 'primary'} size="sm" />
          <View className="flex-1">
            <Text className="text-[14px] font-inter-bold leading-tight text-on-surface">
              {task.title}
            </Text>
            <Text className="mt-0.5 text-[12px] font-inter text-on-surface-variant">
              {task.subtitle}
            </Text>
          </View>
        </View>
        <View className="flex-shrink-0">
          {task.reward.kind === 'money' ? (
            <View className="flex-row items-center gap-1">
              <Text className="text-[15px] font-inter-bold text-warning">
                +{formatBYN(task.reward.amount)}
              </Text>
              <BynIcon size={11} color="#FF7A00" />
            </View>
          ) : (
            <Badge label={`+${task.reward.amount} баллов`} tone="accent" />
          )}
        </View>
      </View>

      <View className="flex-row flex-wrap items-center justify-between gap-1.5 border-t border-track pt-1.5">
        {task.status === 'pending' ? (
          <>
            <Badge label="Ждёт подтверждения" tone="amber" dot />
            <View className="flex-row gap-1.5">
              <Button label="Подтвердить" icon="check" size="sm" onPress={onConfirm} />
              <Button label="Отклонить" variant="secondary" size="sm" onPress={onDecline} />
            </View>
          </>
        ) : (
          <>
            <Badge label="В процессе" tone="primary" dot />
            <Text className="text-[11px] font-inter text-on-surface-variant">
              Напоминание отправлено
            </Text>
          </>
        )}
      </View>
    </Card>
  );
}

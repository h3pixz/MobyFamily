import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import type { Task } from '@/types/dashboard';
import { formatBYN, pluralize } from '@/utils/format';

type ChildTasksSectionProps = {
  tasks: Task[];
  onSubmit: (taskId: string) => void;
  onPressAll: () => void;
};

export function ChildTasksSection({ tasks, onSubmit, onPressAll }: ChildTasksSectionProps) {
  return (
    <View className="gap-gutter">
      <SectionHeader
        title="Задания от родителей"
        actionLabel={`Все (${tasks.length})`}
        onAction={onPressAll}
      />

      {tasks.length === 0 ? (
        <Card className="p-margin">
          <Text className="text-center text-body-sm font-inter text-on-surface-variant">
            Активных заданий нет
          </Text>
        </Card>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            submitted={task.status === 'submitted'}
            onSubmit={() => onSubmit(task.id)}
          />
        ))
      )}
    </View>
  );
}

type TaskCardProps = {
  task: Task;
  submitted: boolean;
  onSubmit: () => void;
};

function TaskCard({ task, submitted, onSubmit }: TaskCardProps) {
  return (
    <Card className="gap-space-xs p-margin">
      <View className="flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-start gap-2">
          <IconTile icon={task.icon} tone="tertiary" size="sm" className="mt-0.5 rounded-xl" />
          <View className="min-w-0 flex-1">
            {task.from ? (
              <View className="mb-1 self-start rounded-full bg-surface-container px-2 py-0.5">
                <Text className="text-label-sm font-inter-medium text-on-surface-variant">
                  {task.from}
                </Text>
              </View>
            ) : null}
            <Text className="text-label-lg font-inter-semibold leading-snug text-on-surface">
              {task.title}
            </Text>
            <Text className="text-body-sm font-inter text-on-surface-variant">{task.subtitle}</Text>
          </View>
        </View>

        {task.reward.kind === 'money' ? (
          <View className="flex-shrink-0 flex-row items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-1">
            <Text className="text-label-md font-inter-bold text-tertiary">
              +{formatBYN(task.reward.amount)}
            </Text>
            <BynIcon size={9} color="#006242" />
          </View>
        ) : (
          <View className="flex-shrink-0 rounded-full bg-tertiary-fixed/40 px-2.5 py-1">
            <Text className="text-label-md font-inter-bold text-tertiary">
              +{task.reward.amount}{' '}
              {pluralize(task.reward.amount, ['балл', 'балла', 'баллов'])}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-end pt-2">
        {submitted ? (
          <Button
            label="На проверке у родителей"
            icon="hourglass-top"
            variant="secondary"
            className="rounded-xl px-4"
            disabled
          />
        ) : (
          <Button
            label="Выполнить"
            icon="check-circle"
            className="rounded-xl px-4"
            onPress={onSubmit}
          />
        )}
      </View>
    </Card>
  );
}

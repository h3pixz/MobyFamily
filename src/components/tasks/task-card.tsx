import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { BynIcon } from '@/components/ui/byn-icon';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import type { TaskItem } from '@/types/tasks';
import { formatBYN } from '@/utils/format';
import { getRelativeTime, getTaskDeadlineLabel } from '@/utils/tasks';

type TaskCardProps = {
  task: TaskItem;
  variant?: 'child' | 'parent';
  submitting?: boolean;
  busy?: boolean;
  onSubmit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
};

export function TaskCard({
  task,
  variant = 'child',
  submitting = false,
  busy = false,
  onSubmit,
  onApprove,
  onReject,
  onCancel,
}: TaskCardProps) {
  const parent = variant === 'parent';
  const review = task.apiStatus === 'SUBMITTED';
  const done = task.apiStatus === 'COMPLETED';
  const cancelled = task.apiStatus === 'CANCELLED';
  const inactive = busy || submitting;

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center justify-between gap-2">
        <StatusPill task={task} />

        <View className="flex-shrink-0 flex-row items-center gap-0.5">
          <Text className="text-headline-sm font-inter-bold text-accent">
            +{formatBYN(task.reward)}
          </Text>
          <BynIcon size={11} color="#10B981" />
        </View>
      </View>

      <View className="flex-row items-start gap-3">
        <IconTile
          icon={task.icon}
          tone={review ? 'secondary' : done ? 'tertiary' : 'primary'}
          size="lg"
          className="rounded-xl"
        />

        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={2}
            className="text-headline-sm font-inter-semibold leading-tight text-on-surface">
            {task.title}
          </Text>
          {task.description ? (
            <Text
              numberOfLines={2}
              className="mt-0.5 text-body-sm font-inter text-on-surface-variant">
              {task.description}
            </Text>
          ) : null}

          <View className="mt-2 flex-row items-center gap-1.5">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-surface-container-high">
              {parent ? (
                <Icon name="face" size={12} color="#424655" />
              ) : task.authorInitials ? (
                <Text className="text-[9px] font-inter-semibold text-on-surface-variant">
                  {task.authorInitials}
                </Text>
              ) : (
                <Icon name="person" size={12} color="#424655" />
              )}
            </View>
            <Text className="text-label-sm font-inter text-on-surface-variant">
              {parent
                ? task.childName
                  ? `Для ${task.childName}`
                  : 'Для любого ребёнка'
                : task.authorName}
            </Text>
          </View>
        </View>
      </View>

      {review ? (
        <View className="flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-1.5 rounded-md bg-surface-container px-2 py-0.5">
            <Icon name="receipt-long" size={14} color="#424655" />
            <Text className="text-label-sm font-inter text-on-surface-variant">
              {task.photoUrl ? 'Фото отчёта прикреплено' : 'Ожидает подтверждения'}
            </Text>
          </View>
          {task.submittedAt ? (
            <Text className="text-label-sm font-inter text-outline">
              Отправлено {getRelativeTime(task.submittedAt)}
            </Text>
          ) : null}
        </View>
      ) : null}

      {review && task.submissionComment ? (
        <View className="rounded-lg bg-surface-low px-3 py-2">
          <Text className="text-label-sm font-inter text-on-surface-variant">
            «{task.submissionComment}»
          </Text>
        </View>
      ) : null}

      {!review && task.rejectionReason ? (
        <View className="flex-row items-start gap-1.5 rounded-lg bg-warning-soft px-3 py-2">
          <Icon name="info" size={14} color="#FF7A00" />
          <Text className="flex-1 text-label-sm font-inter text-secondary">
            На доработке: {task.rejectionReason}
          </Text>
        </View>
      ) : null}

      {parent ? (
        review ? (
          <View className="mt-1 flex-row gap-2">
            <Button
              label="Отклонить"
              variant="secondary"
              className="flex-1 rounded-xl"
              disabled={inactive}
              onPress={onReject}
            />
            <Button
              label="Подтвердить"
              icon="check-circle"
              className="flex-1 rounded-xl"
              loading={inactive}
              onPress={onApprove}
            />
          </View>
        ) : task.apiStatus === 'OPEN' || task.apiStatus === 'IN_PROGRESS' ? (
          <Button
            label="Отменить задание"
            icon="cancel"
            variant="secondary"
            size="lg"
            className="mt-1 rounded-xl"
            disabled={inactive}
            onPress={onCancel}
          />
        ) : null
      ) : task.apiStatus === 'OPEN' || task.apiStatus === 'IN_PROGRESS' ? (
        <Button
          label="Отметить выполненным"
          icon="check-circle"
          size="lg"
          className="mt-1 rounded-xl"
          loading={submitting}
          onPress={onSubmit}
        />
      ) : review ? (
        <Button
          label="Родитель проверяет отчёт"
          icon="sync"
          variant="secondary"
          size="lg"
          className="mt-1 rounded-xl"
          disabled
        />
      ) : cancelled ? (
        <Text className="pt-1 text-center text-label-sm font-inter text-outline">
          Задание отменено
        </Text>
      ) : null}
    </Card>
  );
}

function StatusPill({ task }: { task: TaskItem }) {
  if (task.apiStatus === 'SUBMITTED') {
    return (
      <View className="flex-row items-center gap-1.5 rounded-lg bg-secondary-fixed/50 px-2.5 py-1">
        <Icon name="hourglass-empty" size={15} color="#FB7800" />
        <Text className="text-label-sm font-inter-semibold text-secondary">Ждём проверку</Text>
      </View>
    );
  }
  if (task.apiStatus === 'COMPLETED') {
    return (
      <View className="flex-row items-center gap-1.5 rounded-lg bg-success-soft px-2.5 py-1">
        <Icon name="check-circle" size={15} color="#006242" />
        <Text className="text-label-sm font-inter-semibold text-tertiary">Выполнено</Text>
      </View>
    );
  }
  if (task.apiStatus === 'CANCELLED') {
    return (
      <View className="flex-row items-center gap-1.5 rounded-lg bg-surface-low px-2.5 py-1">
        <Icon name="cancel" size={15} color="#737686" />
        <Text className="text-label-sm font-inter-medium text-on-surface-variant">Отменено</Text>
      </View>
    );
  }
  if (task.apiStatus === 'IN_PROGRESS') {
    return (
      <View className="flex-row items-center gap-1.5 rounded-lg bg-primary-soft px-2.5 py-1">
        <Icon name="autorenew" size={15} color="#1D63ED" />
        <Text className="text-label-sm font-inter-medium text-primary">В работе</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1.5 rounded-lg bg-surface-low px-2.5 py-1">
      <Icon name="schedule" size={15} color="#FB7800" />
      <Text className="text-label-sm font-inter-medium text-on-surface-variant">
        {getTaskDeadlineLabel(task.deadline)}
      </Text>
    </View>
  );
}

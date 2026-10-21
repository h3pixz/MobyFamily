import type { IconName } from '@/types/icons';

export type TaskFilter = 'active' | 'review' | 'done';

export type TaskStatusKind = 'active' | 'review' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadline: string | null;
  authorName: string;
  authorInitials: string;
  status: TaskStatusKind;
  submittedAt: string | null;
  photoUrl: string | null;
  icon: IconName;
  updatedAt: string;
}

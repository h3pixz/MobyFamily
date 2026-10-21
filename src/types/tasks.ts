import type { IconName } from '@/types/icons';

export type TaskFilter = 'active' | 'review' | 'done';

export type TaskStatusKind = 'active' | 'review' | 'done';

export type TaskApiStatus = 'OPEN' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadline: string | null;
  authorName: string;
  authorInitials: string;
  status: TaskStatusKind;
  apiStatus: TaskApiStatus;
  childName: string | null;
  assignedChildId: string | null;
  submittedAt: string | null;
  photoUrl: string | null;
  submissionComment: string | null;
  rejectionReason: string | null;
  icon: IconName;
  updatedAt: string;
}

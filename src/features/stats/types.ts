import type { TaskPriority, TaskStatus } from '@/features/tasks/types';

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  completionRate: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  completedLast7Days: { date: string; count: number }[];
}

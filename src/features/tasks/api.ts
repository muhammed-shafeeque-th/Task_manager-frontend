import { api } from '@/lib/api';
import type { Task, TaskFilters, TaskInput, TaskListResponse } from './types';

export const tasksApi = {
  list: async (filters: TaskFilters) =>
    (
      await api.get<TaskListResponse>('/tasks', {
        params: {
          limit: 100,
          status: filters.status === 'all' ? undefined : filters.status,
          priority: filters.priority === 'all' ? undefined : filters.priority,
          overdue: filters.overdue || undefined,
          search: filters.search || undefined,
        },
      })
    ).data,
  create: async (input: TaskInput) => (await api.post<Task>('/tasks', input)).data,
  update: async (id: string, input: Partial<TaskInput>) => (await api.patch<Task>(`/tasks/${id}`, input)).data,
  remove: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

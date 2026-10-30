import { api } from '@/lib/api';
import type { TaskStats } from './types';

export const statsApi = {
  get: async () => (await api.get<TaskStats>('/tasks/stats')).data,
};

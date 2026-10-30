import { create } from 'zustand';
import { useStatsStore } from '@/features/stats/store';
import { getErrorMessage } from '@/lib/errors';
import { tasksApi } from './api';
import type { Task, TaskFilters, TaskInput } from './types';
import { matchesFilters } from './utils';

export const DEFAULT_FILTERS: TaskFilters = { status: 'all', priority: 'all', search: '', overdue: false };

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
  setFilters: (patch: Partial<TaskFilters>) => void;
  fetchTasks: (options?: { silent?: boolean }) => Promise<void>;
  createTask: (input: TaskInput) => Promise<Task>;
  updateTask: (id: string, input: Partial<TaskInput>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  /** Apply a change received over WebSocket (or from an API response) to local state. */
  upsertTask: (task: Task) => void;
  removeTask: (id: string) => void;
  reset: () => void;
}

let requestSeq = 0; // ignore responses that arrive out of order

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filters: DEFAULT_FILTERS,
  loading: false,
  error: null,

  setFilters: (patch) =>
    set((s) => {
      const changed = (Object.keys(patch) as (keyof TaskFilters)[]).some((k) => patch[k] !== s.filters[k]);
      return changed ? { filters: { ...s.filters, ...patch } } : s; // no-op updates must not trigger a refetch
    }),

  fetchTasks: async ({ silent = false } = {}) => {
    const seq = ++requestSeq;
    if (!silent) set({ loading: true, error: null });
    try {
      const { items } = await tasksApi.list(get().filters);
      if (seq === requestSeq) set({ tasks: items, loading: false, error: null });
    } catch (error) {
      if (seq === requestSeq) set({ loading: false, error: getErrorMessage(error, 'Could not load your tasks.') });
    }
  },

  createTask: async (input) => {
    const task = await tasksApi.create(input);
    get().upsertTask(task);
    useStatsStore.getState().scheduleRefresh(0);
    return task;
  },

  updateTask: async (id, input) => {
    const task = await tasksApi.update(id, input);
    get().upsertTask(task);
    useStatsStore.getState().scheduleRefresh(0);
    return task;
  },

  deleteTask: async (id) => {
    await tasksApi.remove(id);
    get().removeTask(id);
    useStatsStore.getState().scheduleRefresh(0);
  },

  upsertTask: (task) =>
    set((s) => {
      const exists = s.tasks.some((t) => t.id === task.id);
      const visible = matchesFilters(task, s.filters);
      if (exists) {
        return { tasks: visible ? s.tasks.map((t) => (t.id === task.id ? task : t)) : s.tasks.filter((t) => t.id !== task.id) };
      }
      return visible ? { tasks: [task, ...s.tasks] } : s;
    }),

  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  reset: () => set({ tasks: [], filters: DEFAULT_FILTERS, loading: false, error: null }),
}));

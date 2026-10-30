import { create } from 'zustand';
import { getErrorMessage } from '@/lib/errors';
import { statsApi } from './api';
import type { TaskStats } from './types';

interface StatsState {
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  /** Debounced refresh: collapses bursts of changes (e.g. many real-time events) into one request. */
  scheduleRefresh: (delayMs?: number) => void;
  reset: () => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: get().stats === null, error: null });
    try {
      set({ stats: await statsApi.get(), loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error, 'Could not load statistics.') });
    }
  },

  scheduleRefresh: (delayMs = 300) => {
    clearTimeout(timer);
    timer = setTimeout(() => void get().fetchStats(), delayMs);
  },

  reset: () => {
    clearTimeout(timer);
    set({ stats: null, loading: false, error: null });
  },
}));

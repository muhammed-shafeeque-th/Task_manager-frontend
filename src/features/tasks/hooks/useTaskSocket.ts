import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store';
import { useStatsStore } from '@/features/stats/store';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useTaskStore } from '../store';
import type { Task } from '../types';

/**
 * Keeps the task list and statistics in sync with changes made in other tabs/devices.
 * The server skips the originating socket, so these events always come from elsewhere.
 */
export function useTaskSocket(): boolean {
  const token = useAuthStore((s) => s.token);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    const tasks = useTaskStore.getState;
    const stats = useStatsStore.getState;

    const resync = () => {
      void tasks().fetchTasks({ silent: true });
      stats().scheduleRefresh(0);
    };

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    // Events may have been missed while offline, so reload after reconnecting.
    socket.io.on('reconnect', resync);
    socket.on('connect_error', (err) => {
      if (err.message === 'Invalid or expired token') useAuthStore.getState().logout();
    });

    socket.on('task:created', (task: Task) => {
      tasks().upsertTask(task);
      stats().scheduleRefresh();
      toast.info(`"${task.title}" was added in another session`);
    });
    socket.on('task:updated', (task: Task) => {
      tasks().upsertTask(task);
      stats().scheduleRefresh();
      toast.info(`"${task.title}" was updated in another session`);
    });
    socket.on('task:deleted', ({ id, title }: { id: string; title?: string }) => {
      tasks().removeTask(id);
      stats().scheduleRefresh();
      toast.info(`"${title ?? 'A task'}" was deleted in another session`);
    });

    return () => {
      socket.io.off('reconnect', resync);
      disconnectSocket();
      setConnected(false);
    };
  }, [token]);

  return connected;
}

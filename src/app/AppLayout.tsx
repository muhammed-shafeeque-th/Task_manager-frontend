import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { useStatsStore } from '@/features/stats/store';
import { useTaskSocket } from '@/features/tasks/hooks/useTaskSocket';
import { useTaskStore } from '@/features/tasks/store';
import { cn } from '@/lib/cn';
import { Button } from '@/shared/components/Button';
import { Logo } from '@/shared/components/Logo';

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const live = useTaskSocket();

  // Refresh the cached profile on load; an invalid token is handled by the axios 401 interceptor.
  useEffect(() => {
    authApi.me().then(setUser).catch(() => undefined);
  }, [setUser]);

  // Clear per-user data when the session ends so the next user never sees stale tasks.
  useEffect(
    () => () => {
      useTaskStore.getState().reset();
      useStatsStore.getState().reset();
    },
    [],
  );

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted" role="status">
              <span className={cn('size-2 rounded-full', live ? 'bg-accent' : 'bg-amber')} aria-hidden="true" />
              {live ? 'Live' : 'Reconnecting'}
            </span>
            {user && <span className="hidden max-w-40 truncate text-sm sm:block">{user.name}</span>}
            <Button variant="secondary" className="min-h-9" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

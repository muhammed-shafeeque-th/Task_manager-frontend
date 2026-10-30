import { createBrowserRouter, Link } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { AppLayout } from './AppLayout';

function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-1 text-muted">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-accent underline underline-offset-2">
          Back to your tasks
        </Link>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            // Code-split: the dashboard pulls in the charting library.
            lazy: async () => ({ Component: (await import('@/features/tasks/pages/DashboardPage')).DashboardPage }),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

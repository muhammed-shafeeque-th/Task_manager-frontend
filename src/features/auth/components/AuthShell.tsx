import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/Logo';

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer: { text: string; linkLabel: string; to: string };
  children: ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Logo className="mb-8" />
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
        <div className="rounded-lg border border-line bg-surface p-5 sm:p-6">{children}</div>
        <p className="mt-5 text-center text-sm text-muted">
          {footer.text}{' '}
          <Link to={footer.to} className="font-semibold text-accent underline underline-offset-2">
            {footer.linkLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  /** Text alternative for screen readers describing what the chart shows. */
  summary: string;
  empty?: boolean;
  children: ReactNode;
}

export function ChartPanel({ title, summary, empty, children }: ChartPanelProps) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4 sm:p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 h-56" role="img" aria-label={`${title}. ${summary}`}>
        {empty ? (
          <p className="grid h-full place-items-center text-center text-sm text-muted">No data yet. Add a task to see this chart.</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

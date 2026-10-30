import { cn } from '@/lib/cn';
import { useStatsStore } from '../store';

interface Figure {
  label: string;
  value: string;
  tone?: 'danger';
}

/** One continuous band of key figures rather than four separate cards. */
export function StatsStrip() {
  const stats = useStatsStore((s) => s.stats);

  const figures: Figure[] = [
    { label: 'Total tasks', value: stats ? String(stats.total) : '–' },
    { label: 'Completed', value: stats ? String(stats.completed) : '–' },
    { label: 'Overdue', value: stats ? String(stats.overdue) : '–', tone: stats && stats.overdue > 0 ? 'danger' : undefined },
    { label: 'Completion rate', value: stats ? `${stats.completionRate}%` : '–' },
  ];

  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-4">
      {figures.map((f, i) => (
        <div
          key={f.label}
          className={cn(
            'px-4 py-4 sm:px-6 sm:py-5',
            i % 2 === 1 && 'border-l border-line',
            i >= 2 && 'border-t border-line lg:border-t-0',
            i >= 1 && 'lg:border-l',
          )}
        >
          <dt className="text-sm text-muted">{f.label}</dt>
          <dd className={cn('mt-1 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl', f.tone === 'danger' && 'text-danger')}>
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

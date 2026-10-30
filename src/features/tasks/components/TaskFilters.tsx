import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTaskStore } from '../store';
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types';

const control = 'min-h-10 rounded-md border border-line bg-surface px-3 text-sm';

export function TaskFilters() {
  const filters = useTaskStore((s) => s.filters);
  const setFilters = useTaskStore((s) => s.setFilters);

  // Debounce typing so we don't fire a request per keystroke.
  const [search, setSearch] = useState(filters.search);
  useEffect(() => {
    const id = setTimeout(() => setFilters({ search: search.trim() }), 300);
    return () => clearTimeout(id);
  }, [search, setFilters]);

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(control, 'w-full')}
      />
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
        className={control}
      >
        <option value="all">Any status</option>
        {TASK_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}
        className={control}
      >
        <option value="all">Any priority</option>
        {TASK_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>
      <label className={cn(control, 'flex cursor-pointer items-center gap-2 select-none')}>
        <input
          type="checkbox"
          checked={filters.overdue}
          onChange={(e) => setFilters({ overdue: e.target.checked })}
          className="size-4 accent-[var(--color-accent)]"
        />
        Overdue only
      </label>
    </form>
  );
}

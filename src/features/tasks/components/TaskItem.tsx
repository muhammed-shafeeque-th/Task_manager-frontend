import { memo } from 'react';
import { cn } from '@/lib/cn';
import { formatShortDate } from '@/lib/date';
import { Button } from '@/shared/components/Button';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '../constants';
import type { Task } from '../types';
import { isOverdue } from '../utils';

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskItemBase({ task, onToggleDone, onEdit, onDelete }: TaskItemProps) {
  const done = task.status === 'done';
  const overdue = isOverdue(task);

  return (
    <li className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        onClick={() => onToggleDone(task)}
        className={cn(
          'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors',
          done ? 'border-accent bg-accent text-white' : 'border-muted/60 hover:border-accent',
        )}
      >
        {done && (
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn('font-semibold break-words', done && 'text-muted line-through')}>{task.title}</p>
        {task.description && <p className="mt-0.5 line-clamp-2 text-sm break-words text-muted">{task.description}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} aria-hidden="true" />
            {PRIORITY_LABELS[task.priority]} priority
          </span>
          <span>{STATUS_LABELS[task.status]}</span>
          {task.dueDate && (
            <span className={cn(overdue && 'rounded bg-danger-soft px-1.5 py-0.5 font-semibold text-danger')}>
              {overdue ? 'Overdue since' : done ? 'Was due' : 'Due'} {formatShortDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <Button variant="ghost" className="min-h-9 px-3" onClick={() => onEdit(task)} aria-label={`Edit "${task.title}"`}>
          Edit
        </Button>
        <Button variant="ghost" className="min-h-9 px-3 hover:text-danger" onClick={() => onDelete(task)} aria-label={`Delete "${task.title}"`}>
          Delete
        </Button>
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemBase);

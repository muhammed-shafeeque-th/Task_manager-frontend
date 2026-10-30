import { Spinner } from '@/shared/components/Button';
import { Button } from '@/shared/components/Button';
import { useTaskStore, DEFAULT_FILTERS } from '../store';
import type { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  onToggleDone: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreate: () => void;
}

export function TaskList({ onToggleDone, onEdit, onDelete, onCreate }: TaskListProps) {
  const { tasks, loading, error, filters, fetchTasks } = useTaskStore();
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  if (loading) {
    return (
      <div className="grid place-items-center rounded-lg border border-line bg-surface py-16 text-muted" role="status">
        <Spinner className="size-6" />
        <span className="sr-only">Loading tasks</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-line bg-surface p-8 text-center">
        <p className="font-semibold">Your tasks didn't load</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
        <Button variant="secondary" className="mt-4" onClick={() => void fetchTasks()}>
          Try again
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface/60 p-10 text-center">
        <p className="font-semibold">{hasFilters ? 'No tasks match these filters' : 'No tasks yet'}</p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters ? 'Clear a filter or search for something else.' : 'Add your first task to start tracking progress.'}
        </p>
        {!hasFilters && (
          <Button className="mt-4" onClick={onCreate}>
            Add a task
          </Button>
        )}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggleDone={onToggleDone} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}

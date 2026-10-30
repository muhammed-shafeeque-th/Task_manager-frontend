import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CompletionTrendChart, PriorityChart, StatusChart } from '@/features/stats/components/charts';
import { StatsStrip } from '@/features/stats/components/StatsStrip';
import { useStatsStore } from '@/features/stats/store';
import { getErrorMessage } from '@/lib/errors';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { TaskFilters } from '../components/TaskFilters';
import { TaskFormModal } from '../components/TaskFormModal';
import { TaskList } from '../components/TaskList';
import { useTaskStore } from '../store';
import type { Task, TaskInput } from '../types';

export function DashboardPage() {
  const filters = useTaskStore((s) => s.filters);
  const { fetchTasks, createTask, updateTask, deleteTask } = useTaskStore.getState();
  const fetchStats = useStatsStore((s) => s.fetchStats);
  const statsError = useStatsStore((s) => s.error);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  // (Re)load whenever filters change; stats are independent of filters.
  useEffect(() => {
    void fetchTasks();
  }, [filters, fetchTasks]);
  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);
  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setFormOpen(true);
  }, []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const handleSubmit = async (input: TaskInput) => {
    try {
      if (editing) {
        await updateTask(editing.id, input);
        toast.success('Task updated');
      } else {
        await createTask(input);
        toast.success('Task created');
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleDone = useCallback(
    async (task: Task) => {
      try {
        await updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [updateTask],
  );

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletePending(true);
    try {
      await deleteTask(deleting.id);
      toast.success('Task deleted');
      setDeleting(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your tasks</h1>
        <Button onClick={openCreate}>New task</Button>
      </div>

      <StatsStrip />
      {statsError && (
        <p role="alert" className="text-sm text-danger">
          {statsError}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatusChart />
        <PriorityChart />
        <div className="md:col-span-2 lg:col-span-1">
          <CompletionTrendChart />
        </div>
      </div>

      <section aria-labelledby="task-list-heading" className="space-y-3">
        <h2 id="task-list-heading" className="text-lg font-semibold">
          All tasks
        </h2>
        <TaskFilters />
        <TaskList onToggleDone={handleToggleDone} onEdit={openEdit} onDelete={setDeleting} onCreate={openCreate} />
      </section>

      <TaskFormModal open={formOpen} task={editing} onClose={closeForm} onSubmit={handleSubmit} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete this task?"
        message={deleting ? `"${deleting.title}" will be permanently deleted.` : ''}
        confirmLabel="Delete task"
        loading={deletePending}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

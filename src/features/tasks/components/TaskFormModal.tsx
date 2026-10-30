import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { fromDateInputValue, toDateInputValue } from '@/lib/date';
import { Button } from '@/shared/components/Button';
import { SelectField, TextAreaField, TextField } from '@/shared/components/Field';
import { Modal } from '@/shared/components/Modal';
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskInput } from '../types';

const formSchema = z.object({
  title: z.string().trim().min(1, 'Give the task a title').max(120, 'Keep the title under 120 characters'),
  description: z.string().trim().max(2000, 'Keep the description under 2000 characters'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

const EMPTY: FormValues = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

interface TaskFormModalProps {
  open: boolean;
  /** Pass a task to edit it; omit to create a new one. */
  task?: Task | null;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
}

export function TaskFormModal({ open, task, onClose, onSubmit }: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      task
        ? {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: toDateInputValue(task.dueDate),
          }
        : EMPTY,
    );
  }, [open, task, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, dueDate: fromDateInputValue(values.dueDate) });
  });

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'New task'}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField label="Title" autoFocus error={errors.title?.message} {...register('title')} />
        <TextAreaField label="Description" rows={3} error={errors.description?.message} {...register('description')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Status" {...register('status')}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </SelectField>
          <SelectField label="Priority" {...register('priority')}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </SelectField>
        </div>
        <TextField label="Due date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {task ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

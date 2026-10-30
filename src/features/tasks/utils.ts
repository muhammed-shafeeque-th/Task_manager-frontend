import type { Task, TaskFilters } from './types';

export const isOverdue = (task: Pick<Task, 'status' | 'dueDate'>): boolean =>
  task.status !== 'done' && task.dueDate !== null && new Date(task.dueDate).getTime() < Date.now();

/** Client-side mirror of the server's list filters, used to place real-time updates correctly. */
export function matchesFilters(task: Task, filters: TaskFilters): boolean {
  if (filters.status !== 'all' && task.status !== filters.status) return false;
  if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
  if (filters.overdue && !isOverdue(task)) return false;
  if (filters.search) {
    const query = filters.search.toLowerCase();
    if (!task.title.toLowerCase().includes(query) && !task.description.toLowerCase().includes(query)) return false;
  }
  return true;
}

import { api } from "@/lib/api";
import type { Task, TaskFilters, TaskInput, TaskListResponse } from "./types";

export const tasksApi = {
  list: async (filters: TaskFilters) => {
    const tasks = await api.get<TaskListResponse>("/tasks", {
      params: {
        limit: 100,
        status: filters.status === "all" ? undefined : filters.status,
        priority: filters.priority === "all" ? undefined : filters.priority,
        overdue: filters.overdue || undefined,
        search: filters.search || undefined,
      },
    });
    return tasks.data;
  },
  create: async (input: TaskInput) => {
    const result = await api.post<Task>("/tasks", input);
    return result.data;
  },
  update: async (id: string, input: Partial<TaskInput>) => {
    const updatedTask = await api.patch<Task>(`/tasks/${id}`, input);
    return updatedTask.data;
  },
  remove: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

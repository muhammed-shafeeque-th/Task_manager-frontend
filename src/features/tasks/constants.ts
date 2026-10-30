import type { TaskPriority, TaskStatus } from "./types";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "#8a97a3",
  in_progress: "#d99a2b",
  done: "#1d5c4e",
};
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "#8fb3a7",
  medium: "#d99a2b",
  high: "#b4412f",
};

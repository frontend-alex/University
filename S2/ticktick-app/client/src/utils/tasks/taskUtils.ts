import { Task } from "@/types/response";
import { useMemo } from "react";

export const getCompletedTasks = (tasks: Task[]) => {
  return useMemo(() => tasks.filter((task) => task.completed), [tasks]);
};

export const getIncompletedTasks = (tasks: Task[]) => {
  return useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
};

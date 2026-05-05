import { memo, useState } from "react";
import { TodoPriority } from "@/types/enums";
import { toast } from "sonner";
import { useTasks } from "./hook/useTask";
import TaskColumn from "./components/KanbanBoard/TaskColumn";

interface KanbanBoardProps {
  listId: string;
}

const KanbanBoard = ({ listId }: KanbanBoardProps) => {
  const { tasks, isLoading, updateTask } = useTasks(listId);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const priorities: TodoPriority[] = [
    TodoPriority.None,
    TodoPriority.Low,
    TodoPriority.Medium,
    TodoPriority.High,
    TodoPriority.Urgent,
  ];

  const getTasksByPriority = (priority: TodoPriority) =>
    tasks.filter((task) => task.priority === priority);


  const moveTask = (taskId: string, newPriority: TodoPriority) => {
    updateTask.mutate(
      { id: taskId, priority: newPriority },
      {
        onError: () => {
          toast.error("Failed to update task priority");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-100px)] p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
        {priorities.map((priority) => (
          <TaskColumn
            key={priority}
            priority={priority}
            tasks={getTasksByPriority(priority)}
            onDropTask={(taskId) => moveTask(taskId, priority)}
            onDragStartTask={setDraggedTask}
            draggedTask={draggedTask}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(KanbanBoard);

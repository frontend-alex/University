import { Task } from "@/types/response";
import { SortableTask } from "./SortableTask";
import TaskDropdownMenu from "./TaskDropdownMenu";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import EmptyState from "@/components/tasks/EmptyTasks";

interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string;
  onSelectTask: (id: string | null) => void;
  title?: string;
  updateTask: any;
  softDeleteTask: any;
}

const TaskList = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  title,
  updateTask,
  softDeleteTask,
}: TaskListProps) => {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      )}
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            tasks.map((task) => (
              <SortableTask
                key={task._id}
                task={task}
                selected={selectedTaskId === task._id}
                onSelectTask={onSelectTask}
              >
                <TaskDropdownMenu
                  task={task}
                  updateTask={updateTask}
                  softDeleteTask={softDeleteTask}
                />
              </SortableTask>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskList;
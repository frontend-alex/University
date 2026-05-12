import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { priorityColorMap } from "@/constants/data";
import { useTasks } from "@/routes/(root)/lists/partials/hook/useTask";
import { TodoPriority } from "@/types/enums";
import { Task } from "@/types/response";

interface CompleteTaskCheckboxProps {
  task: Task;
  disabled?: boolean;
  size?: "sm" | "md";
}

const CompleteTaskCheckbox = ({
  task,
  disabled = false,
  size = "md",
}: CompleteTaskCheckboxProps) => {
  const { updateTask } = useTasks(task.list);

  const handleToggle = () => {
    if (disabled) return;
    updateTask.mutate({
      id: task._id,
      completed: !task.completed,
    });
  };

  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={handleToggle}
      disabled={disabled}
      className={cn(
        size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
        "ring-1 ring-input/30 cursor-pointer",
        priorityColorMap[task.priority as TodoPriority],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    />
  );
};

export default CompleteTaskCheckbox;

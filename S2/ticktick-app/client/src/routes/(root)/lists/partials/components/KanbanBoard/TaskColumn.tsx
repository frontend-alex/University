import TaskCard from "./TaskCard";
import ColumnHeader from "./ColumnHeader";
import TaskAddCard from "./TaskAddCard";
import useOnClickOutside from "@/hooks/useClickOutisde";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TodoPriority } from "@/types/enums";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  priority: TodoPriority;
  tasks: any[];
  onDropTask: (taskId: string) => void;
  onDragStartTask: (taskId: string | null) => void;
  draggedTask: string | null;
}

const TaskColumn = ({
  priority,
  tasks,
  onDropTask,
  onDragStartTask,
  draggedTask,
}: TaskColumnProps) => {
  const [showTaskCardAt, setShowTaskCardAt] = useState<"top" | "bottom" | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cardRef, () => setShowTaskCardAt(null));

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (draggedTask) {
      onDropTask(draggedTask);
      onDragStartTask(null);
    }
  };

  const handleDragEnter = () => {
    if (draggedTask) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={cn(
        "bg-accent/30 rounded-md flex flex-col h-full overflow-hidden relative transition-all duration-200",
        isDragOver && "border-dashed border-accent"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: isDragOver ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 border-2 border-dashed border-neutal-500 dark:border-neutral-700 pointer-events-none z-10 rounded-md"
      />

      <ColumnHeader
        priority={priority}
        count={tasks.length}
        onAddTop={() => setShowTaskCardAt("top")}
      />

      <div className="flex-1 overflow-y-auto px-2 space-y-3 z-0 relative">
        <AnimatePresence>
          {showTaskCardAt === "top" && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TaskAddCard setShowTaskCardAt={setShowTaskCardAt} />
            </motion.div>
          )}
        </AnimatePresence>

        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDragStart={onDragStartTask} />
        ))}

        <AnimatePresence>
          {showTaskCardAt === "bottom" && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TaskAddCard setShowTaskCardAt={setShowTaskCardAt} />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant={"ghost"}
          className="flex-start w-full hover:bg-accent mt-2"
          onClick={() => setShowTaskCardAt("bottom")}
        >
          <Plus />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskColumn;
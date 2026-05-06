import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Menu } from "lucide-react";
import { Task } from "@/types/response";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Skeleton } from "@/components/ui/skeleton";

import CompleteTaskCheckbox from "@/components/inputs/CompleteInput";
import { User } from "@/types/types";
import { UserProfileCard } from "@/routes/(root)/inbox/partials/InboxActivity";

interface SortableTaskProps {
  task: Task;
  selected: boolean;
  onSelectTask: (id: string | null) => void;
  children?: React.ReactNode;
  showPriorityIndicator?: boolean;
  showDragHandle?: boolean;
}

export const SortableTask = ({
  task,
  selected,
  onSelectTask,
  children,
  showDragHandle = true,
}: SortableTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const handleTaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const ignoredSelectors = [
      '[role="button"]',
      'input[type="checkbox"]',
      '[role="dialog"]',
      "[data-radix-collection-item]",
      ".dialog-trigger",
    ];

    const shouldIgnore = ignoredSelectors.some((selector) =>
      (e.target as HTMLElement).closest(selector)
    );

    if (shouldIgnore) return;
    onSelectTask(task._id);
  };

  return (
    <Suspense fallback={<Skeleton className="w-full h-10" />}>
      <div
        className="group flex items-center relative"
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        onClick={handleTaskClick}
      >
        {showDragHandle && (
          <DragHandleButton attributes={attributes} listeners={listeners} />
        )}
        <TaskContent task={task} selected={selected}>
          {children}
        </TaskContent>
      </div>
    </Suspense>
  );
};

const DragHandleButton = ({ attributes, listeners }: any) => (
  <button
    className="text-stone-400 opacity-0 group-hover:opacity-100 absolute -left-5 p-2 hover:cursor-grab active:cursor-grabbing"
    {...attributes}
    {...listeners}
    onClick={(e) => e.stopPropagation()}
  >
    <Menu size={10} />
  </button>
);

interface TaskContentProps {
  task: Task;
  selected: boolean;
  children?: React.ReactNode;
}

const TaskContent = ({ task, selected, children }: TaskContentProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 p-2 border-b transition-colors cursor-pointer hover:bg-accent hover:rounded-lg w-full group",
      selected ? "bg-accent/50 rounded-md" : "border-accent",
      task.completed && "text-muted-foreground opacity-35"
    )}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <CompleteTaskCheckbox task={task} disabled={false} />
      <p className="truncate">{task.title}</p>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {task.assignedTo.map((user: User) => (
        <UserProfileCard key={user._id} user={user} />
      ))}
      <Suspense fallback={<Skeleton className="w-12 h-8" />}>
        {children}
      </Suspense>
    </div>
  </div>
);

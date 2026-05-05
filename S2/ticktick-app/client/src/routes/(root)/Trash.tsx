import EditTask from "./lists/partials/EditTask";
import EmptyState from "@/components/tasks/EmptyTasks";

import { useSearchParams } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getListEmoji } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { EllipsisVertical, Undo } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableTask } from "./lists/partials/components/NormalBoard/SortableTask";
import { useTasks } from "./lists/partials/hook/useTask";
import { useEffect } from "react";
import { Task } from "@/types/response";
import { DeleteDialog} from '@/components/dialogs/index';


const Trash = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    trashTasks,
    isTrashLoading,
    refetchTrashTasks,
    restoreTask,
    permanentlyDeleteTask,
  } = useTasks();


  const selectedTaskId = searchParams.get("task");
  const selectedTask = trashTasks.find((task) => task._id === selectedTaskId);

  useEffect(() => {
    if (
      (!selectedTaskId || !trashTasks.some((task) => task._id === selectedTaskId)) &&
      trashTasks.length > 0
    ) {
      setSearchParams({ task: trashTasks[0]._id });
    }
  }, [selectedTaskId, trashTasks, setSearchParams]);

  const handleDragEnd = (_event: any) => {
  };

  const TrashDropdownMenu = ({ task }: { task: Task }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical
            size={15}
            className="opacity-0 group-hover:opacity-100 cursor-pointer text-stone-400 hover:text-black dark:hover:text-white"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() =>
              restoreTask.mutate(
                { id: task._id },
                {
                  onSuccess: () => {
                    toast.success("Task restored");
                    refetchTrashTasks();
                  },
                  onError: () => toast.error("Failed to restore task"),
                }
              )
            }
            className="cursor-pointer"
          >
            <Undo className="mr-2 h-4 w-4" />
            <span>Restore</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteDialog
              buttonText="Delete permanently"
              title="Permanently delete task"
              description="You're about to permanently delete this task. This action cannot be undone."
              onConfirm={() =>
                permanentlyDeleteTask.mutate(
                  { id: task._id },
                  {
                    onSuccess: () => {
                      toast.success("Task permanently deleted");
                      refetchTrashTasks();
                    },
                    onError: () => toast.error("Failed to delete task"),
                  }
                )
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isTrashLoading) return <TrashSkeleton />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[100dvh] relative overflow-hidden">
      <div className="col-span-2 flex flex-col border-r border-accent p-5 lg:h-[100dvh] overflow-y-scroll">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="w-full flex items-center gap-2">
            <SidebarTrigger className="flex md:hidden" />
            <h1 className="text-3xl font-corm font-bold">Trash</h1>
            <span>{getListEmoji("Trash")}</span>
          </div>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={trashTasks.map((t) => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={`space-y-2 ${trashTasks.length === 0 ? "h-screen" :"border-red-400  border-l-4 p-2"}`}>
              {trashTasks.length === 0 ? (
                <EmptyState image="/images/trash.png" imageClassName="w-full object-contain" />
              ) : (
                trashTasks.map((task) => (
                  <SortableTask
                    key={task._id}
                    task={task}
                    selected={selectedTaskId === task._id}
                    onSelectTask={(id) =>
                      setSearchParams(id ? { task: id } : {})
                    }
                    showPriorityIndicator={false}
                    showDragHandle={false}
                  >
                    <TrashDropdownMenu task={task} />
                  </SortableTask>
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {selectedTask && (
        <EditTask
          selectedTask={selectedTask}
          readOnly={true}
          showTrashActions={true}
          onRestore={() => {
            restoreTask.mutate(
              { id: selectedTask._id },
              {
                onSuccess: () => {
                  toast.success("Task restored");
                  refetchTrashTasks();
                  setSearchParams({});
                },
              }
            );
          }}
          onDeletePermanently={() => {
            permanentlyDeleteTask.mutate(
              { id: selectedTask._id },
              {
                onSuccess: () => {
                  toast.success("Task permanently deleted");
                  refetchTrashTasks();
                  setSearchParams({});
                },
              }
            );
          }}
        />
      )}
    </div>
  );
};


const TrashSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[100dvh] relative overflow-hidden p-5">
    <div className="flex-col-10 col-span-2 border-r border-accent pr-5">
      <div className="flex-col-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex-col-3">
        {Array.from({ length: 7 }).map((_, idx) => (
          <Skeleton key={idx} className="w-full h-10" />
        ))}
      </div>
    </div>
    <div className="flex-col-3 px-5">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-62 w-full" />
    </div>
  </div>
);

export default Trash;
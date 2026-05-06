import useWorkspace from "@/routes/(root)/inbox/partials/hooks/useWorkspace";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Suspense } from "react";
import { Task } from "@/types/response";
import { TodoPriority } from "@/types/enums";
import { DeleteDialog } from "@/components/dialogs/index";
import { EllipsisVertical, Flag, Tags, User } from "lucide-react";
import { AssignUserDropdown }  from '@/components/dropdowns/index';
import { PRIORITY_COLORS } from "@/components/dropdowns/task/PriorityDropdown";

interface TaskDropdownMenuProps {
  task: Task;
  updateTask: any;
  softDeleteTask: any;
}

const TaskDropdownMenu = ({
  task,
  updateTask,
  softDeleteTask,
}: TaskDropdownMenuProps) => {
  const { workspaceIdData } = useWorkspace(
    localStorage.getItem("activeWorkspaceId") as string
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical
          size={15}
          className="opacity-0 group-hover:opacity-100 cursor-pointer text-stone-400 hover:text-black dark:hover:text-white"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-[12px] font-normal text-stone-400">
          Priority
        </DropdownMenuLabel>
        <div className="flex-row-3">
          {Object.values(TodoPriority).map((priority) => (
            <DropdownMenuItem
              onClick={() => updateTask.mutate({ priority, id: task._id })}
              key={priority}
              className={cn("cursor-pointer")}
            >
              <Flag className={cn("h-4 w-4", PRIORITY_COLORS[priority])} />
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group transition-all cursor-pointer">
          <div className="flex-row-2">
            <Tags className=" text-stone-400" />
            <span>Tags</span>
          </div>
        </DropdownMenuItem>

        {workspaceIdData?.type === "personal" ? null : (
          <DropdownMenuItem>
            <Suspense fallback={null}>
              <AssignUserDropdown
                data={workspaceIdData}
                onSelectUser={(userId) =>
                  updateTask.mutateAsync({ id: task._id, assignedTo: userId })
                }
              >
                <div className="flex-row-2">
                  <User />
                  Add assignee
                </div>
              </AssignUserDropdown>
            </Suspense>
          </DropdownMenuItem>
        )}

        <DeleteDialog
          onConfirm={() =>
            softDeleteTask.mutate(
              { id: task._id },
              {
                onSuccess: () => {
                  toast.success("Task deleted");
                },
                onError: () => toast.error("Failed to delete task"),
              }
            )
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskDropdownMenu;

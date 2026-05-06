import { toast } from "sonner";
import { User } from "@/types/types";
import { Task } from "@/types/response";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTasks } from "../../hook/useTask";
import { useLists } from "../../hook/useList";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/dialogs/index";
import { TimeSelector } from "@/components/ui/time-selector";
import { AssignUserDropdown } from "@/components/dropdowns/index";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import { Calendar, Check, CheckCircle, Pen, Trash, X } from "lucide-react";
import { UserProfileCard } from "@/routes/(root)/inbox/partials/InboxActivity";
import useWorkspace from "@/routes/(root)/inbox/partials/hooks/useWorkspace";

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
}

const TaskCard = ({ task, onDragStart }: TaskCardProps) => {
  const workspaceId = localStorage.getItem("activeWorkspaceId") as string;

  const { workspaceIdData } = useWorkspace(workspaceId);
  const { refetch } = useLists(workspaceId);
  const { updateTask, softDeleteTask } = useTasks(task.list, refetch);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleEditSubmit = async () => {
    if (title.trim() && title !== task.title) {
      await updateTask.mutateAsync({ id: task._id, title: title.trim() });
    }
    setIsEditing(false);
  };

  return (
    <Card
      draggable
      onDragStart={() => onDragStart(task._id)}
      className="p-3 py-3 cursor-move group transition hover:shadow-sm border-accent relative rounded-md"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex-row-2">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSubmit();
                }}
              >
                <Input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleEditSubmit}
                  className="border-none no-ring p-0 shadow-none text-sm font-medium leading-tight h-5"
                />
              </form>
            ) : (
              <h3
                className="text-sm font-medium leading-tight"
                onDoubleClick={() => setIsEditing(true)}
              >
                {task.title}
              </h3>
            )}
            {task.completed && (
              <CheckCircle className="text-green-500" size={15} />
            )}
          </div>

          <div className="flex-row-2 p-1 border border-accent rounded-md opacity-0 group-hover:opacity-100">
            {task.completed ? (
              <Button
                onClick={() =>
                  updateTask.mutateAsync({ id: task._id, completed: false })
                }
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
              >
                <X className="h-3 w-3 text-destructive" />
              </Button>
            ) : (
              <Button
                onClick={() =>
                  updateTask.mutateAsync(
                    { id: task._id, completed: true },
                    {
                      onSuccess: () => {
                        toast.success("Task marked as completed");
                      },
                    }
                  )
                }
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
              >
                <Check className="h-3 w-3 text-stone-400" />
              </Button>
            )}
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
            >
              <Pen className="h-3 w-3 text-stone-400" />
            </Button>

            <Suspense>
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
              >
                <Button variant={"ghost"} className="h-5 w-5 p-0">
                  <Trash className="text-stone-400" />
                </Button>
              </DeleteDialog>
            </Suspense>
          </div>
        </div>

        <div className="flex-row-1">
          {workspaceIdData?.type === "personal" ? null : task.assignedTo
              ?.length > 0 ? (
            <Suspense fallback={null}>
              <AssignUserDropdown
                data={workspaceIdData}
                onSelectUser={(userId) =>
                  updateTask.mutateAsync({ id: task._id, assignedTo: userId })
                }
                buttonClassName="h-5 w-5 p-0 text-stone-400"
              >
                <div className="flex items-center -space-x-3 cursor-pointer">
                  {task.assignedTo.map((user: User) => (
                    <UserProfileCard user={user} />
                  ))}
                </div>
              </AssignUserDropdown>
            </Suspense>
          ) : (
            <AssignUserDropdown
              data={workspaceIdData}
              onSelectUser={(userId) =>
                updateTask.mutateAsync({ id: task._id, assignedTo: userId })
              }
              buttonClassName="h-5 w-5 p-0 text-stone-400"
            />
          )}
          <TimeSelector onChange={(time) => console.log(time)}>
            <Button className="text-stone-400 h-5 w-5 p-0" variant={"ghost"}>
              <Calendar />
            </Button>
          </TimeSelector>
        </div>
      </div>
    </Card>
  );
};

export default memo(TaskCard);

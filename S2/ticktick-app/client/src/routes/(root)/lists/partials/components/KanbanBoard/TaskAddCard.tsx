import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
} from "@/components/dropdowns/task/PriorityDropdown";

import { AssignUserDropdown, PriorityDropdown  } from "@/components/dropdowns/index";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useWorkspace from "@/routes/(root)/inbox/partials/hooks/useWorkspace";
import { TodoPriority } from "@/types/enums";
import { ArrowBigUp, Calendar1, Flag, User as Userr } from "lucide-react";
import { useTasks } from "../../hook/useTask";
import { useParams } from "react-router-dom";
import { memo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskValues } from "@/utils/schema";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { TimeSelector } from "@/components/ui/time-selector";

const TaskAddCard = ({
  setShowTaskCardAt,
}: {
  setShowTaskCardAt: React.Dispatch<
    React.SetStateAction<"top" | "bottom" | null>
  >;
}) => {
  const workspaceId = localStorage.getItem("activeWorkspaceId") as string;

  const { listId } = useParams();

  const { workspaceIdData } = useWorkspace(workspaceId);

  const { createTask } = useTasks(listId);

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
    },
    mode: "onChange",
  });

  const assignedToId = form.watch("assignedTo");
  const assignedUser = workspaceIdData?.members.find(
    (m) => m.user._id === assignedToId
  )?.user;

  const onSubmit = (data: CreateTaskValues) => {
    createTask.mutate(
      {
        title: data.title,
        assignedTo: data.assignedTo,
        priority: data.priority || TodoPriority.None,
        list: listId,
      },
      {
        onSuccess: () => {
          form.reset();
          setShowTaskCardAt(null);
        },
      }
    );
  };

  return (
    <Card className="px-2 py-3 group transition hover:shadow-sm  relative rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-between mb-1">
            <Input
              placeholder="Task name..."
              className="text-sm font-medium leading-tight pr-2 shadow-none no-ring border-none bg-transparent h-5"
              {...form.register("title")}
            />
            <Button
              size={"sm"}
              type="submit"
              variant={"main"}
              className="w-15 h-7 text-[12px] mr-2 disabled:cursor-not-allowed"
              disabled={!form.formState.isValid}
            >
              <ArrowBigUp /> Save
            </Button>
          </div>
          <div></div>
          <AssignUserDropdown
            onSelectUser={(userId) => form.setValue("assignedTo", userId)}
            data={workspaceIdData}
          >
            <Button
              variant={"ghost"}
              size={"sm"}
              type="button"
              className="w-full flex-start text-stone-400 cursor-pointer text-[12px]"
            >
              {assignedUser ? (
                <Avatar className="size-5">
                  <AvatarFallback></AvatarFallback>
                  <AvatarImage src={assignedUser.imageUrl} />
                </Avatar>
              ) : (
                <Userr size={12} className="text-stone-400 mr-2" />
              )}
              {assignedUser ? `${assignedUser.username}` : "Assign User"}
            </Button>
          </AssignUserDropdown>
          <Suspense fallback={null}>
            <PriorityDropdown
              value={TodoPriority.None}
              onChange={(priority) => form.setValue("priority", priority)}
            >
              <Button
                variant={"ghost"}
                size={"sm"}
                type="button"
                className="w-full flex-start text-stone-400 cursor-pointer text-[12px]"
              >
                <Flag
                  size={12}
                  className={cn(
                    "mr-2",
                    PRIORITY_COLORS[form.watch("priority") || TodoPriority.None]
                  )}
                />
                {form.watch("priority") &&
                form.watch("priority") !== TodoPriority.None
                  ? PRIORITY_LABELS[form.watch("priority") ?? TodoPriority.None]
                  : "Add priority"}
              </Button>
            </PriorityDropdown>
          </Suspense>
          <TimeSelector onChange={(time) => console.log(time)}>
            <Button
              variant={"ghost"}
              size={"sm"}
              type="button"
              className="w-full flex-start text-stone-400 cursor-pointer text-[12px]"
            >
              <Calendar1 className="mr-2" />
              Set a Date
            </Button>
          </TimeSelector>
        </form>
      </Form>
    </Card>
  );
};

export default memo(TaskAddCard);

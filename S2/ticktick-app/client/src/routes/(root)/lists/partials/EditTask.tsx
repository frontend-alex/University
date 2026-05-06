import EnhanceWithAIButton from "@/components/inputs/EnhanceButton";
import CompleteTaskCheckbox from "@/components/inputs/CompleteInput";

import { useTasks } from "./hook/useTask";
import { EditTaskProps } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Undo, Trash2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TodoPriority, TodoStatus } from "@/types/enums";
import { DeleteDialog } from "@/components/dialogs/index";
import { TimeSelector } from "@/components/ui/time-selector";
import { useCallback, useEffect, Suspense, memo } from "react";
import { PriorityDropdown } from '@/components/dropdowns/index';
import { taskFormSchema, TaskFormValues } from "@/utils/schema";
import { VoiceInputButton } from "@/components/inputs/VoiceInputButton";
import { Textarea } from "@/components/ui/textarea";

const BaseEditTask = ({
  selectedTask,
  readOnly = false,
  showTrashActions = false,
  onRestore,
  onDeletePermanently,
}: Omit<EditTaskProps, "form">) => {
  const [searchParams] = useSearchParams();
  const selectedTaskId = searchParams.get("task") ?? "";

  const updateTaskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TodoPriority.None,
      status: TodoStatus.Todo,
    },
  });

  const { updateTask } = useTasks(selectedTaskId);
  const {
    reset,
    setValue,
    register,
    control,
    handleSubmit,
    getValues,
    formState: { isDirty },
  } = updateTaskForm;

  useEffect(() => {
    if (!selectedTask) return;
    reset({
      title: selectedTask.title,
      description: selectedTask.description ?? "",
      priority: selectedTask.priority as TodoPriority,
      status: selectedTask.status,
    });
  }, [selectedTask?._id]);

  const onSubmit = useCallback(
    (values: TaskFormValues) => {
      if (!selectedTask || readOnly) return;
      updateTask.mutate(
        {
          ...values,
          id: selectedTask._id,
        },
        {
          onSuccess: () => reset(values),
        }
      );
    },
    [selectedTask, readOnly, reset, updateTask]
  );

  return (
    <div className="flex flex-col overflow-y-scroll relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
        <div className="flex-between border-b border-accent px-5 py-2 sticky top-0 mb-5 z-10">
          <div className="flex-row-3 h-[20px]">
            {selectedTask && (
              <CompleteTaskCheckbox task={selectedTask} disabled={readOnly} />
            )}
            <TimeSelector onChange={(time) => console.log(time)}>
              <Button variant="ghost">
                <Calendar className="text-stone-400" />
              </Button>
            </TimeSelector>
          </div>

          <div className="flex gap-1">
            <Suspense fallback={<Skeleton className="w-12 h-10 rounded-md" />}>
              {selectedTask && (
                <Suspense fallback={null}>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <PriorityDropdown
                        value={field.value}
                        onChange={(priority) => {
                          field.onChange(priority);
                          updateTask.mutate({
                            id: selectedTask._id,
                            priority,
                          });
                        }}
                        disabled={readOnly}
                      />
                    )}
                  />
                </Suspense>
              )}
            </Suspense>

            <VoiceInputButton
              onTranscript={(text) =>
                setValue("description", text, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={readOnly}
            />
            <EnhanceWithAIButton
              disabled={readOnly}
              value={getValues("description") || ""}
              onEnhance={(enhanced) =>
                setValue("description", enhanced, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="dark:space-y-4 px-5">
          <Input
            placeholder="Task title"
            className="border-0 shadow-none rounded-none dark:rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-2xl font-bold py-5 placeholder:text-2xl"
            {...register("title")}
            style={{ fontSize: "1.5em" }}
            readOnly={readOnly}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />

          <Suspense fallback={<Skeleton className="h-[100px] w-full" />}>
            <Textarea
              placeholder="Task description"
              className="border-0 rounded-md shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none min-h-[100px]"
              {...register("description")}
              readOnly={readOnly}
            />
          </Suspense>
        </div>

        {/* Save Bar */}
        <AnimatePresence>
          {!readOnly && isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 border border-accent px-4 py-2 w-max flex-center rounded-lg shadow-lg flex items-center space-x-4 z-20 backdrop-blur"
            >
              <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                You have unsaved changes
              </span>
              <Button type="submit" size="sm">
                Save
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Trash Actions */}
      {showTrashActions && (
        <div className="flex-between border-t border-accent p-4">
          <Button variant="ghost" onClick={onRestore}>
            <Undo />
            Restore
          </Button>
          <DeleteDialog
            onConfirm={onDeletePermanently || (() => {})}
            buttonText="Delete permanently"
            title="Permanently delete task"
            description="You're about to permanently delete this task. This action cannot be undone."
          >
            <Button variant="ghost">
              <Trash2 />
            </Button>
          </DeleteDialog>
        </div>
      )}
    </div>
  );
};

const EditTask = (props: EditTaskProps) => {
  if (!props.selectedTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select a task to view details</p>
      </div>
    );
  }

  return <BaseEditTask {...props} />;
};

export default memo(EditTask);

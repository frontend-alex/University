import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "@/utils/schema";
import { Input } from "@/components/ui/input";
import { List, SingleTaskResponse } from "@/types/response";
import { toast } from "sonner";

interface TaskCreateInputProps {
  list: List;
  createTask: any;
}

const TaskCreateInput = ({ list, createTask }: TaskCreateInputProps) => {
  const createTaskForm = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "" },
  });

  const handleCreateTask = (values: { title: string }) => {
    if (!list) return;
    createTask.mutate(
      { ...values, list: list._id },
      {
        onSuccess: async (data: SingleTaskResponse) => {
          toast.success(data.message);
          createTaskForm.reset();
        },
        onError: (err: any) => {
          toast.error("Error!", {
            description: err.response.data.message,
          });
        },
      }
    );
  };

  return (
    <div className="relative">
      <form onBlur={createTaskForm.handleSubmit(handleCreateTask)}>
        <Input
          {...createTaskForm.register("title")}
          placeholder="+ Add task"
          className="pr-10 border-0 input-register focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
        />
      </form>
    </div>
  );
};

export default TaskCreateInput;

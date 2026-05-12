import { toast } from "sonner";
import { List } from "@/types/response";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editListSchema, EditListValues } from "@/utils/schema";
import { useLists } from "../../lists/partials/hook/useList";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ListSettings = ({ list }: { list: List }) => {
  const { updateList, refetch } = useLists(
    localStorage.getItem("activeWorkspaceId") as string
  );

  const editTitleForm = useForm<EditListValues>({
    resolver: zodResolver(editListSchema),
    defaultValues: { title: list.title },
  });

  const handleEditSubmit = async (data: EditListValues) => {
    if (data.title !== list.title) {
      await updateList.mutateAsync(
        { listId: list._id, title: data.title },
        {
          onSuccess: async (data) => {
            toast.success(data.message);
            await refetch();
          },
        }
      );
    }
  };

  return (
    <div className="flex-col-1">
      <Form {...editTitleForm}>
        <form onSubmit={editTitleForm.handleSubmit(handleEditSubmit)}>
          <FormField
            control={editTitleForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    style={{ fontSize: "1.875rem" }}
                    onBlur={editTitleForm.handleSubmit(handleEditSubmit)}
                    className="text-3xl input-register no-ring w-full font-bold py-5"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ListSettings;

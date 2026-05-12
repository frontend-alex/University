import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { memo, useEffect, useState } from "react";
import { Plus, Flag, LoaderCircle } from "lucide-react";
import { ListType, TodoPriority } from "@/types/enums";
import { capitalizeListType, getListEmoji } from "@/lib/utils";
import { CreateListValues, createListschema } from "@/utils/schema";
import { useLists } from "@/routes/(root)/lists/partials/hook/useList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_COLORS } from "@/components/dropdowns/task/PriorityDropdown";

interface CreateListDialogProps {
  workspaceId: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

const CreateListDialog = ({ workspaceId, children }: CreateListDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { createList, isLoading } = useLists(workspaceId);

  const form = useForm<CreateListValues>({
    resolver: zodResolver(createListschema),
    defaultValues: {
      title: "",
      priority: TodoPriority.None,
      listType: ListType.Custom,
    },
  });

  const listType = form.watch("listType");

  useEffect(() => {
    form.setValue("title", listType === ListType.Custom ? "" : listType);
  }, [listType, form]);

  const handleSubmit = (values: CreateListValues) => {
    const title =
      listType === ListType.Custom
        ? values.title
        : capitalizeListType(values.title);

    createList.mutate(
      { ...values, title, workspaceId },
      {
        onSuccess: (data: any) => {
          setOpen(false);
          form.reset();
          navigate(`/${data.list._id}/${data.list.title}`);
          toast.success("Successfully created a new list");
        },
      }
    );
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    children?.props.onClick?.(e);
    setOpen(true);
  };

  const renderSelectField = (
    name: keyof CreateListValues,
    label: string,
    options: string[],
    renderLabel: (value: string) => React.ReactNode
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {renderLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          React.cloneElement(children, { onClick: handleTriggerClick })
        ) : (
          <Plus
            size={15}
            onClick={() => setOpen(true)}
            className="cursor-pointer text-stone-400 hover:text-black dark:hover:text-white z-[100]"
          />
        )}
      </DialogTrigger>

      <DialogContent className="flex-col-5">
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
          <DialogDescription>
            From here you can create a list where you can organize and store all
            your tasks.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {renderSelectField(
              "listType",
              "List Type",
              Object.values(ListType),
              (type) => (
                <>
                  {getListEmoji(type)} {capitalizeListType(type)}
                </>
              )
            )}

            {renderSelectField(
              "priority",
              "List Priority",
              Object.values(TodoPriority),
              (type) => (
                <>
                  <Flag className={PRIORITY_COLORS[type as TodoPriority]} />{" "}
                  {capitalizeListType(type)}
                </>
              )
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className="input-register no-ring"
                      {...field}
                      disabled={listType !== ListType.Custom}
                      placeholder="Enter a custom title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex-row-1">
                    <LoaderCircle className="animate-spin" /> Loading...
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreateListDialog);

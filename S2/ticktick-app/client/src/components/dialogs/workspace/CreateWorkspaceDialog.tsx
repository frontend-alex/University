import { Button } from "@/components/ui/button";
import { ListType } from "@/types/enums";
import { useForm } from "react-hook-form";
import { LoaderCircle, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListschema, CreateListValues } from "@/utils/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";

import { PremiumDialog } from '../index'

const CreateWorkspaceDialog = () => {
  const { isPremium } = useAuth();

  const [open, setOpen] = useState(false);

  const form = useForm<CreateListValues>({
    resolver: zodResolver(createListschema),
    defaultValues: {
      title: "",
      listType: ListType.Custom,
    },
  });

  const listType = form.watch("listType");

  useEffect(() => {
    if (listType !== ListType.Custom) {
      form.setValue("title", listType);
    } else {
      form.setValue("title", "");
    }
  }, [listType, form]);

  // const onSubmit = (values: CreateListValues) => {
  // };

  const onSubmit = () => {};

  if (!isPremium) return <PremiumDialog />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Plus
          size={15}
          className="cursor-pointer text-stone-400 hover:text-black dark:hover:text-white z-[100]"
        />
      </DialogTrigger>
      <DialogContent className="flex-col-5">
        <DialogHeader>
          <DialogTitle>Create new workspace</DialogTitle>
          <DialogDescription>
            From here you can create a workspace where you can organize and
            store all your lists with your tasks.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="input-register no-ring"
                      disabled={listType !== ListType.Custom}
                      placeholder="Enter workspace name"
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
              <Button type="submit" disabled={true}>
                {true ? (
                  <div className="flex-row-1">
                    <LoaderCircle className="animate-spin" /> Loading
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

export default CreateWorkspaceDialog;

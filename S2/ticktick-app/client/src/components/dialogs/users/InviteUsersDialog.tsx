import React from "react";
import { Crown, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { inviteUsersSchemform, inviteUserValue } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { WorkspaceMember } from "@/types/types";
import { TriggerWrapper } from "@/components/TriggerWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {ManageUsersDropdown} from "@/components/dropdowns/index";

interface InviteUsersDialogProps {
  members: WorkspaceMember[];
  title?: string;
  description?: string;
  buttonText?: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  onSubmit?: (
    data: inviteUserValue,
    closeDialog: () => void
  ) => void | Promise<void>;
}

const InviteUsersDialog = ({
  members,
  title = "Invite People",
  description = "Invite team members to collaborate on this workspace.",
  buttonText = "Invite Users",
  children,
  onSubmit,
}: InviteUsersDialogProps) => {
  const inviteUserForm = useForm<inviteUserValue>({
    resolver: zodResolver(inviteUsersSchemform),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (
    data: inviteUserValue,
    closeDialog: () => void
  ) => {
    if (onSubmit) {
      await onSubmit(data, closeDialog);
      inviteUserForm.reset();
    }
  };

  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex-start font-normal hover:text-primary -ml-[2px] group cursor-pointer"
        >
          <UserPlus className="mr-[1px] h-4 w-4 text-stone-400 group-hover:text-primary" />
          {buttonText}
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <Form {...inviteUserForm}>
              <form
                onSubmit={inviteUserForm.handleSubmit((data) =>
                  handleSubmit(data, () => setOpen(false))
                )}
                className="mt-4"
              >
                <FormField
                  control={inviteUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex-row-2">
                          <Input
                            className="input-register no-ring"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                          <Button type="submit">Send Invite</Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <div className="flex-col-3">
              <DialogTitle className="text-base">Members</DialogTitle>
              {members.map((member, idx) => (
                <div className="flex-between gap-3" key={idx}>
                  <div className="flex-row-3">
                    <Avatar>
                      <AvatarFallback></AvatarFallback>
                      <AvatarImage src={member.user.imageUrl}/>
                    </Avatar>
                    <div className="flex-col">
                      <h1 className="font-semibold text-sm">
                        {member.user.username}
                      </h1>
                      <p className="text-stone-400 text-[12px]">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    {member.role === "owner" ? (
                      <Crown size={15} className="text-amber-500 mr-3"/>
                    ) : (
                      <ManageUsersDropdown />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </TriggerWrapper>
  );
};

export default InviteUsersDialog;

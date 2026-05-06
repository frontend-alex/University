import React from "react";
import { Shield, User, UserRoundX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { TriggerWrapper } from "@/components/TriggerWrapper";
import { Button } from "@/components/ui/button";

const ManageUsersDropdown = ({
  icon: Icon = User,
  buttonText,
  children,
}: {
  icon?: any;
  buttonText?: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}) => {
  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="w-full flex-start font-normal -ml-[2px] group cursor-pointer"
        >
          <Icon className="mr-[1px] h-4 w-4 text-stone-400" />
          {buttonText}
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="dropdown-label">
              Manage User
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Shield size={15} className="mr-2" /> Roles
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Admin</DropdownMenuItem>
                <DropdownMenuItem>Moderator</DropdownMenuItem>
                <DropdownMenuItem>Guest</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem className="group">
              {/* <DeleteDialog icon={UserRoundX} buttonText="Kick User" onConfirm={() => {}}/> */}
              <UserRoundX className="group-hover:text-destructive" />
              <span className="group-hover:text-destructive">Kick User</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TriggerWrapper>
  );
};

export default ManageUsersDropdown;
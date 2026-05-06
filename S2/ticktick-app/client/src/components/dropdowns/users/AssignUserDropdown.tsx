import { useState } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { TriggerWrapper } from "@/components/TriggerWrapper";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { WorkspaceMember } from "@/types/types";
import { Key } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Input } from "@/components/ui/input";

const AssignUserDropdown = ({
  assign = true,
  buttonClassName,
  icon: Icon = User,
  dropdownLabel = "Assign User",
  buttonText,
  children,
  data,
  onSelectUser,
}: {
  data: any;
  assign?: boolean;
  buttonClassName?: string;
  dropdownLabel?: string;
  icon?: any;
  buttonText?: string;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  onSelectUser?: (userId: string) => void;
}) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const membersToShow = assign
    ? data?.members
    : data?.members?.filter(
        (member: WorkspaceMember) => member.user._id !== user?._id
      );

  const filteredMembers = membersToShow?.filter((member: WorkspaceMember) =>
    member.user.username.toLowerCase().includes(search.toLowerCase())
  );
  
  if (data?.type === "personal") return null;

  return (
    <TriggerWrapper
      customTrigger={children}
      defaultTrigger={
        <Button className={cn("", buttonClassName)} variant="ghost">
          <Icon />
          {buttonText}
        </Button>
      }
    >
      {({ open, setOpen }) => (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel className="dropdown-label">
              {dropdownLabel}
            </DropdownMenuLabel>

            <div className="relative">
              <Search
                className="absolute text-stone-400 top-2 left-3"
                size={15}
              />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 input-register no-ring px-10"
              />
            </div>

            {filteredMembers?.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No users available
              </div>
            ) : (
              filteredMembers?.map((member: WorkspaceMember, idx: Key) => (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectUser?.(member.user._id);
                    setOpen(false);
                  }}
                  key={idx}
                  className="group"
                >
                  <Avatar className="size-6 mr-2">
                    <AvatarFallback>
                      {member.user.username.substring(0, 2)}
                    </AvatarFallback>
                    <AvatarImage src={member.user.imageUrl} />
                  </Avatar>
                  {member.user.username}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TriggerWrapper>
  );
};

export default AssignUserDropdown;

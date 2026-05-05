import { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TodoPriority } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "@/components/dialogs/index";
import { PRIORITY_COLORS } from "../task/PriorityDropdown";
import { TriggerWrapper } from "@/components/TriggerWrapper";
import { EllipsisVertical, Flag, Pen, Settings, Trash } from "lucide-react";
import { useLists } from "@/routes/(root)/lists/partials/hook/useList";

interface EditListDropdownProps {
  listId: string;

  buttonText?: string;
  icon?: any;
  redirect?: boolean;
  isLoading?: boolean;
  children?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  onEditClick?: () => void;
}

const EditListDropdown = ({
  onEditClick,
  listId,
  children,
  redirect = false,
  isLoading = false,
  buttonText = "List Settings",
  icon: Icon = EllipsisVertical,
}: EditListDropdownProps) => {
  const navigate = useNavigate();
  const workspaceId = localStorage.getItem("activeWorkspaceId") || "";
  const { deleteList, updateList } = useLists(workspaceId);

  const handleDelete = () => {
    deleteList.mutate(
      { id: listId },
      {
        onSuccess: (data) => {
          if (redirect) {
            navigate(`/${workspaceId}/inbox`);
          }
          toast.success(data.message);
        },
      }
    );
  };

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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="dropdown-label">
              List Settings
            </DropdownMenuLabel>

            <div className="flex-row-3 mt-2">
              {Object.values(TodoPriority).map((priority) => (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    updateList.mutateAsync({ listId, priority });
                  }}
                  key={priority}
                  className={cn("cursor-pointer")}
                >
                  <Flag className={cn("h-4 w-4", PRIORITY_COLORS[priority])} />
                </DropdownMenuItem>
              ))}
            </div>

            {/* Edit Option */}
            {redirect ? (
              <DropdownMenuItem
                onClick={onEditClick}
                className="cursor-pointer"
              >
                <Pen className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuItem onClick={() => navigate(`/${listId}/settings`)}>
              <div className="flex-row-3">
                <Settings />
                Settings
              </div>
            </DropdownMenuItem>

            {/* Delete Option */}
            <Suspense fallback={<Skeleton className="w-20 h-10 rounded-md" />}>
              <DeleteDialog onConfirm={handleDelete} isLoading={isLoading}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer group focus:text-destructive"
                >
                  <div className="flex items-center">
                    <Trash className="mr-2 text-stone-400 group-hover:text-destructive h-4 w-4" />
                    <span>Delete</span>
                  </div>
                </DropdownMenuItem>
              </DeleteDialog>
            </Suspense>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TriggerWrapper>
  );
};

export default EditListDropdown;

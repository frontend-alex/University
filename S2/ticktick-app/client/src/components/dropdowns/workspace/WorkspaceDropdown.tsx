import useWorkspace from "@/routes/(root)/inbox/partials/hooks/useWorkspace";

import { DeleteDialog, InviteDialog } from "@/components/dialogs/index";

import { toast } from "sonner";
import { EllipsisVertical, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthProvider";
import { Workspace, WorkspaceMember } from "@/types/types";
import { Suspense } from "react";

type Props = {
  workspace: Workspace;
  members?: WorkspaceMember[];
  onEdit?: () => void;
  onDelete?: () => void;
};

const WorkspaceDropdown = ({ workspace, onEdit, members }: Props) => {
  const { user } = useAuth();
  const { inviteUserToWorkspace, leaveWorkspace } = useWorkspace(workspace._id);

  const isOwner = workspace.members.some(
    (m) => m.role === "owner" && m.user._id === user?._id
  );

  const ownedWorkspacesCount =
    user?.workspaces?.filter((w) =>
      w.members.some((m) => m.role === "owner" && m.user._id === user._id)
    ).length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical
          className="text-stone-400 -ml-2 cursor-pointer"
          size={15}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="dropdown-label">
          Options
        </DropdownMenuLabel>

        {!isOwner && (
          <Suspense fallback={null}>
            <DeleteDialog
              icon={LogOut}
              title="You are about to leave this workspace"
              description="You are about to leave this workspace. Are you sure you want to permanently leave?"
              confirmText="Confirm Leave"
              buttonText="Leave workspace"
              onConfirm={() => leaveWorkspace.mutateAsync({})}
            />
          </Suspense>
        )}

        {isOwner && (
          <>
            <Suspense fallback={null}>
              <InviteDialog
                onSubmit={async (data, closeDialog) => {
                  inviteUserToWorkspace.mutateAsync(
                    { emailToInvite: data.email, sender: user?._id },
                    {
                      onSuccess: (res: any) => {
                        toast.success(res.message);
                        closeDialog();
                      },
                      onError: (err: any) => {
                        toast.error(err?.response?.data?.message);
                      },
                    }
                  );
                }}
                members={members ?? []}
              />
            </Suspense>
            <DropdownMenuItem onClick={onEdit}>
              <Settings />
              Settings
            </DropdownMenuItem>

            {ownedWorkspacesCount >= 2 && (
              <DeleteDialog
                buttonText="Delete workspace"
                onConfirm={() => window.alert("cicki")}
              />
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceDropdown;

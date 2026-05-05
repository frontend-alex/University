import { toast } from "sonner";
import { useRef } from "react";
import { formatTime } from "@/lib/utils";
import { getSocket } from "@/lib/socket";
import { LoaderCircle } from "lucide-react";
import { usePostData } from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/routes/(root)/notifications/partials/hooks/useNotifications";

const InviteNotificationCard = ({ invitation }: { invitation: any }) => {
  const socket = getSocket();
  const { refetchUser } = useAuth();
  const { deleteNotification, refetch, markAsRead } = useNotifications();

  const hasMarkedRead = useRef(false);

  const handleMarkAsRead = async () => {
    if (!invitation?.read && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      await markAsRead.mutateAsync({ id: invitation._id });
    }
  };

  const workspaceId = invitation?.data?.workspaceId;
  const invitationId = invitation?._id;

  const { mutateAsync, isPending } = usePostData<any, void>(
    workspaceId ? `/workspaces/${workspaceId}/accept-invite` : "",
    {
      onSuccess: async () => {
        if (invitationId) {
          await deleteNotification.mutateAsync({ id: invitationId });
        }

        socket?.emit(SOCKET_EVENTS.JOIN_WORKSPACE_AND_PERSIST, workspaceId);
        refetchUser();
        refetch();
        toast.success("Hooray, you're in!");
      },
      onError: () => {
        toast.error("Failed to accept invite.");
      },
    }
  );

  const handleAccept = async () => {
    if (!invitation) return;
    await mutateAsync();
  };

  const handleDecline = async () => {
    if (invitation?._id) {
      await deleteNotification.mutateAsync({ id: invitation._id });
    }
  };

  return (
    <div onMouseEnter={handleMarkAsRead}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Avatar className="size-11">
              <AvatarImage src={invitation.data.invitedByProfilePicture} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-col-1 min-w-0">
            <p className="text-sm text-stone-400 leading-relaxed max-w-[300px]">
              <span className="font-medium text-black dark:text-white">
                {invitation.data.invitedBy}
              </span>{" "}
              invited you to join{" "}
              <span className="font-medium text-black dark:text-white">
                {invitation.data.workspaceTitle}
              </span>
            </p>
            <p className="text-sm text-stone-400">
              {formatTime(invitation.createdAt)}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" onClick={handleDecline}>
                Decline
              </Button>
              <Button onClick={handleAccept} disabled={isPending}>
                {isPending && (
                  <LoaderCircle className="animate-spin mr-1.5" size={12} />
                )}
                {isPending ? "Accepting..." : "Accept"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteNotificationCard;

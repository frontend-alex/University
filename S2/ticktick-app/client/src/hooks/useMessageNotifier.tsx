import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthProvider";

export function useMessageNotifier() {
  const socket = getSocket();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNewMessage = (data: {
      chatId: string;
      fromUser: { _id: string; username: string; imageUrl?: string };
      content: string;
      workspaceId: string;
    }) => {
      if (data.fromUser._id === user._id) return;

      console.log(data)

      const isViewingThisChat = location.pathname.includes(`/chats/${data.chatId}`);
      // const isOnChatsPage = location.pathname.includes("/chats");

      if (!isViewingThisChat) {
        toast.custom((t) => (
          <div
            onClick={() => {
              toast.dismiss(t);
              // localStorage.setItem("activeChatId", data.chatId);
              // localStorage.setItem("activeWorkspaceId", data.workspaceId);
              // navigate(`/workspace/${data.workspaceId}/chats/${data.chatId}`);
            }}
            className="group flex w-full max-w-sm cursor-pointer items-start rounded-md border border-border bg-background p-4 shadow-lg transition hover:bg-muted"
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full">
              <img 
                src={data.fromUser.imageUrl} 
                alt={data.fromUser.username}
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                New message from {data.fromUser.username}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {data.content}
              </p>
            </div>
          </div>
        ), {
          duration: 10000,
        });
      }
    };

    // Handle socket connection
    const setupSocket = () => {
      socket.on(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleNewMessage);
    };

    if (socket.connected) {
      setupSocket();
    } else {
      socket.on('connect', setupSocket);
    }

    return () => {
      socket.off(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleNewMessage);
      socket.off('connect', setupSocket);
    };
  }, [socket, user?._id, location.pathname, navigate]);
}
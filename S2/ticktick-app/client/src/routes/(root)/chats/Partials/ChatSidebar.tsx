import useWorkspace from "../../inbox/partials/hooks/useWorkspace";

import { cn } from "@/lib/utils";
import { getSocket } from "@/lib/socket";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthProvider";
import { useActiveChat } from "./hooks/useActiveChat";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useState, useEffect, Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssignUserDropdown } from "@/components/dropdowns/index";
import { useChatConversations } from "./hooks/useChatConversations";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChatSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { workspaceId, chatId } = useParams();
  const { workspaceIdData } = useWorkspace(workspaceId);
  const { conversations, startConversation, refetchConversations } =
    useChatConversations();
  const { setActiveChat } = useActiveChat();
  const [visible, setVisible] = useState(true);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      refetchConversations();
    };

    socket.on(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleUpdate);
    socket.on(SOCKET_EVENTS.MARK_AS_READ, handleUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleUpdate);
      socket.off(SOCKET_EVENTS.MARK_AS_READ, handleUpdate);
    };
  }, [socket, refetchConversations]);

  useEffect(() => {
    refetchConversations();
  }, [location.pathname, refetchConversations]);

  return (
    <div className="relative h-full flex">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out h-full border-r border-accent bg-background",
          visible ? "w-[350px]" : "w-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-[14px] border-b border-accent">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations"
                className="pl-8 input-register no-ring"
              />
            </div>
          </div>

          <div className="flex justify-between items-center p-4 border-b border-accent">
            <h2 className="font-semibold">Messages</h2>
            <div>
              <Suspense fallback={null}>
                <AssignUserDropdown
                  onSelectUser={(userId) =>
                    startConversation.mutateAsync({
                      toUserId: userId,
                      workspaceId: workspaceId || "",
                    })
                  }
                  data={workspaceIdData}
                  dropdownLabel="Start a chat"
                  icon={Plus}
                  assign={false}
                />
              </Suspense>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {conversations?.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                  (p) => p.userId._id !== user?._id
                );
                const currentUserParticipant = conversation.participants.find(
                  (p) => p.userId._id === user?._id
                );

                const myUnreadCount = currentUserParticipant?.unreadCount ?? 0;
                if (!otherParticipant) return null;

                const lastMessage = conversation.lastMessage;
                const hasUnread = myUnreadCount > 0;

                return (
                  <Link
                    key={conversation._id}
                    to={`/workspace/${workspaceId}/chats/${conversation._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveChat(conversation._id);
                      navigate(
                        `/workspace/${workspaceId}/chats/${conversation._id}`
                      );
                    }}
                    className={cn(
                      "flex items-center p-4 hover:bg-accent transition-colors",
                      chatId === conversation._id
                        ? "bg-accent"
                        : hasUnread
                        ? "bg-muted/10"
                        : ""
                    )}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={otherParticipant.userId.imageUrl} />
                      <AvatarFallback>
                        {otherParticipant.userId.username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p
                          className={cn(
                            "font-medium truncate",
                            hasUnread
                              ? "font-semibold text-foreground"
                              : "text-foreground/90"
                          )}
                        >
                          {otherParticipant.userId.username}
                        </p>
                        <time
                          className={cn(
                            "text-xs",
                            hasUnread
                              ? "text-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {lastMessage?.createdAt
                            ? new Date(
                                lastMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </time>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <p
                          className={cn(
                            "text-sm truncate max-w-[250px]",
                            hasUnread
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {lastMessage?.content || "No messages yet"}
                        </p>
                        {hasUnread && (
                          <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full shrink-0">
                            {myUnreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -ml-4 transition-all duration-300 z-[1000000]",
          visible ? "left-[350px]" : "left-0"
        )}
      >
        <button
          onClick={() => setVisible(!visible)}
          className="bg-muted hover:bg-accent border border-border w-8 h-8 rounded-full flex items-center justify-center shadow"
        >
          {visible ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

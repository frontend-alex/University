import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useParams } from "react-router-dom";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useFetchData, usePostData } from "@/hooks/useFetch";
import { ChatArrayResponse, SingleChatResponse } from "@/types/response";

export const useChatConversations = () => {
  const socket = getSocket();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  if (!workspaceId) {
    console.error("Workspace ID is missing");
    throw new Error("Workspace ID is required");
  }

  if (!socket) {
    console.error("Socket ID is missing");
    throw new Error("Socket ID is required");
  }

  const { data: conversationsResponse, refetch: refetchConversations } =
    useFetchData<ChatArrayResponse>(
      ["chats", workspaceId],
      `/chat?workspaceId=${workspaceId}`
    );

  const startConversation = usePostData<
    SingleChatResponse,
    { toUserId: string; workspaceId: string }
  >("/chat", {
    onSuccess: (res) => {
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, res.data._id);
      refetchConversations();
    },
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleRefetch = () => {
      refetchConversations();
    };

    socket.on(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleRefetch);
    socket.on(SOCKET_EVENTS.MARK_AS_READ, handleRefetch);
    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, handleRefetch);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleRefetch);
      socket.off(SOCKET_EVENTS.MARK_AS_READ, handleRefetch);
      socket.off(SOCKET_EVENTS.JOIN_CONVERSATION, handleRefetch);
    };
  }, [socket, refetchConversations]);

  return {
    conversations: conversationsResponse?.data || [],
    startConversation,
    refetchConversations,
  };
};

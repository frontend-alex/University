import { useFetchData, usePostData } from "@/hooks/useFetch";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { MessageArrayResponse, SingleMessageResponse } from "@/types/response";
import { useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "react-router-dom";

export const useChatMessages = () => {
  const socket = getSocket();
  const { user } = useAuth();
  const { chatId, workspaceId } = useParams<{ chatId: string, workspaceId: string }>();

  if (!chatId) {
    console.error("Chat ID is missing");
    throw new Error("Chat ID is required");
  }

  if (!socket) {
    console.error("Socket is missing");
    throw new Error("Socket is required");
  }

  const {
    data: messagesResponse,
    refetch: refetchMessages,
    isLoading: isLoadingMessages,
  } = useFetchData<MessageArrayResponse>(
    ["messages", chatId],
    `/messages/${chatId}`
  );

  const markAsRead = usePostData<{ success: boolean }, { chatId: string }>(
    "/messages/mark-as-read"
  );

  const handleMarkAsRead = useCallback(() => {
    if (!user?._id) {
      console.error("User not authenticated");
      return;
    }
    markAsRead.mutate({ chatId });
    socket.emit(SOCKET_EVENTS.MARK_AS_READ, { conversationId: chatId });
  }, [chatId, user?._id, socket]);

  const sendMessage = usePostData<
    SingleMessageResponse,
    { content: string; chatId: string; toUserId: string }
  >("/messages", {
    onSuccess: (res) => {
      if (res.data) {
        socket.emit(SOCKET_EVENTS.DIRECT_MESSAGE, {
          toUserId: res.data.toUserId,
          chatId,
          content: res.data.content,
          workspaceId
        });
      }
      refetchMessages();
    },
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewMessage = () => {
      refetchMessages();
    };

    socket.on(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MARK_AS_READ, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MARK_AS_READ, handleNewMessage);
    };
  }, [socket, chatId, refetchMessages]);

  return {
    messages: messagesResponse?.data || [],
    isLoadingMessages,
    sendMessage,
    handleMarkAsRead,
    refetchMessages,
  };
};
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useParams } from "react-router-dom";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

export const useActiveChat = () => {
  const socket = getSocket();
  const { chatId } = useParams();

  const setActiveChat = (newChatId: string) => {
    localStorage.setItem("activeChatId", newChatId);
    if (socket) {
      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, newChatId);
    }
  };

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
    }
  }, [chatId]);

  return { setActiveChat };
};
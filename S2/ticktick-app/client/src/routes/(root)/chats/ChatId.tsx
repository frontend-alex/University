import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./Partials/ChatHeader";
import { ChatInput } from "./Partials/ChatInput";
import { ChatMessages } from "./Partials/ChatMessage";
import { useChatMessages } from "./Partials/hooks/useChatMessages";
import { useChatConversations } from "./Partials/hooks/useChatConversations";

export default function ChatId() {
  const { chatId, workspaceId } = useParams<{ chatId: string; workspaceId: string }>();
  const { messages, isLoadingMessages, handleMarkAsRead } = useChatMessages();
  const { conversations } = useChatConversations();

  if (!chatId || !workspaceId) {
    console.error("Missing chatId or workspaceId");
    return <div>Error: Missing required parameters</div>;
  }

  const currentConversation = conversations.find((c) => c._id === chatId);

  useEffect(() => {
    if (messages.length > 0) {
      handleMarkAsRead();
    }
  }, [messages, handleMarkAsRead]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={currentConversation} />
      <ChatMessages 
        messages={messages} 
        isLoading={isLoadingMessages}
        onMarkAsRead={handleMarkAsRead}
      />
      <ChatInput />
    </div>
  );
}
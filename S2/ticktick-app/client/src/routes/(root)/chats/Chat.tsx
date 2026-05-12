import { useChatConversations } from "./Partials/hooks/useChatConversations";

export default function Chat() {
  const { conversations } = useChatConversations();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">
          {conversations.length > 0
            ? "Select a conversation to start chatting"
            : "No conversations yet. Start a new chat!"}
        </p>
      </div>
    </div>
  );
}
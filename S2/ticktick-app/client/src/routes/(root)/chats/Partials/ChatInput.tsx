import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "react-router-dom";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatConversations } from "./hooks/useChatConversations";

export function ChatInput() {
  const [message, setMessage] = React.useState("");
  const { user } = useAuth();
  const { chatId } = useParams<{ chatId: string }>();
  const { sendMessage } = useChatMessages();
  const { conversations } = useChatConversations();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!chatId) {
    console.error("Chat ID is missing");
    return null;
  }

  const currentConversation = conversations.find((c) => c._id === chatId);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !currentConversation || !user?._id) return;

    const recipient = currentConversation.participants.find(
      (p) => p.userId._id !== user._id
    );
    
    if (!recipient) return;

    try {
      await sendMessage.mutateAsync({
        chatId,
        content: message,
        toUserId: recipient.userId._id,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [message, currentConversation, user, chatId, sendMessage]);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    // Typing indicator logic could go here
  }, []);

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="pr-10 input-register no-ring"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" onClick={handleSend} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
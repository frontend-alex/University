import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useRef, useCallback, useState, useMemo, memo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Message } from "@/types/response";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onMarkAsRead?: () => void;
}

export const ChatMessages = memo(function ChatMessages({
  messages,
  isLoading,
  onMarkAsRead,
}: ChatMessagesProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolled, setIsAutoScrolled] = useState(true);
  const prevMessagesLength = useRef(messages.length);
  const isInitialLoad = useRef(true);
  const scrollDebounce = useRef<NodeJS.Timeout>(null);
  const lastMessageId = useRef<string | null>(null);

  const memoizedMessages = useMemo(() => messages, [JSON.stringify(messages)]);

  const userId = useMemo(() => user?._id, [user?._id]);

  const formatDateSeparator = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  }, []);

  const shouldShowAvatar = useCallback(
    (current: Message, previous?: Message) => {
      if (!previous) return true;
      const sameSender = previous.sender._id === current.sender._id;
      const timeDiff =
        new Date(current.createdAt).getTime() -
        new Date(previous.createdAt).getTime();
      return !sameSender || timeDiff > 20000;
    },
    []
  );

  const shouldShowDate = useCallback((current: Message, previous?: Message) => {
    if (!previous) return true;
    const currentDate = new Date(current.createdAt).toDateString();
    const previousDate = new Date(previous.createdAt).toDateString();
    return currentDate !== previousDate;
  }, []);
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    if (scrollDebounce.current) {
      clearTimeout(scrollDebounce.current);
    }

    scrollDebounce.current = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current!;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;

      setIsAutoScrolled(isNearBottom);

      if (isNearBottom && onMarkAsRead) {
        onMarkAsRead();
      }
    }, 100);
  }, [onMarkAsRead]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollDebounce.current) {
        clearTimeout(scrollDebounce.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!scrollRef.current || !memoizedMessages.length) return;

    const newMessages = memoizedMessages.length > prevMessagesLength.current;
    const isNewMessage =
      lastMessageId.current !==
      memoizedMessages[memoizedMessages.length - 1]?._id;
    prevMessagesLength.current = memoizedMessages.length;
    lastMessageId.current =
      memoizedMessages[memoizedMessages.length - 1]?._id || null;

    if (isInitialLoad.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      isInitialLoad.current = false;
      return;
    }

    if ((newMessages || isNewMessage) && isAutoScrolled) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [memoizedMessages, isAutoScrolled]);

  const lastOwnSeenIndex = useMemo(() => {
    for (let i = memoizedMessages.length - 1; i >= 0; i--) {
      const msg = memoizedMessages[i];
      if (
        msg.sender._id === userId &&
        msg.readBy.some((u) => u._id !== userId)
      ) {
        return i;
      }
    }
    return -1;
  }, [memoizedMessages, userId]);

  const renderMessage = useCallback(
    (message: Message, index: number) => {
      const prevMessage = memoizedMessages[index - 1];
      const currentDate = new Date(message.createdAt);
      const isOwnMessage = message.sender._id === userId;
      const showDate = shouldShowDate(message, prevMessage);
      const within20s =
        prevMessage &&
        message.sender._id === prevMessage.sender._id &&
        currentDate.getTime() - new Date(prevMessage.createdAt).getTime() <=
          20000;

      return (
        <div key={`${message._id}-${index}`} className="space-y-1">
          {showDate && (
            <div className="sticky top-0 z-10 flex justify-center my-2">
              <div className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border shadow-sm">
                {formatDateSeparator(message.createdAt)}
              </div>
            </div>
          )}
          <div
            className={`flex ${
              isOwnMessage ? "justify-end" : "justify-start"
            } ${within20s ? "-mt-3" : "mt-3"}`}
          >
            {!isOwnMessage && (
              <div className="mr-2">
                {shouldShowAvatar(message, prevMessage) ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.imageUrl} />
                    <AvatarFallback>
                      {message.sender.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8" />
                )}
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {!isOwnMessage && !within20s && (
                <p className="text-xs font-medium mb-1">
                  {message.sender.username}
                </p>
              )}
              <p className="text-sm">{message.content}</p>
              {!within20s && (
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {currentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>

          {isOwnMessage && index === lastOwnSeenIndex && (
            <div className="flex gap-1 mt-2 justify-end">
              {message.readBy
                .filter((u) => u._id !== userId)
                .map((reader) => (
                  <Avatar key={reader._id} className="h-4 w-4 border shadow-sm">
                    <AvatarImage src={reader.imageUrl} />
                    <AvatarFallback>
                      {reader.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </div>
          )}
        </div>
      );
    },
    [
      formatDateSeparator,
      shouldShowAvatar,
      shouldShowDate,
      userId,
      lastOwnSeenIndex,
      memoizedMessages,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden p-4">
        <div className="space-y-5 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => {
            const isOwn = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex items-start ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwn && (
                  <div className="mr-2">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  </div>
                )}
                <div
                  className={`rounded-xl p-3 space-y-2 max-w-[75%] w-fit ${
                    isOwn ? "bg-primary/30" : "bg-muted"
                  }`}
                >
                  <div className="h-4 w-[90%] bg-muted-foreground/20 rounded" />
                  <div className="h-4 w-[70%] bg-muted-foreground/30 rounded" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Empty state
  if (!memoizedMessages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground text-sm">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto h-full p-4 space-y-4"
    >
      {memoizedMessages.map(renderMessage)}
    </div>
  );
});

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthProvider";

export function ChatHeader({ conversation }: any) {
  const { user } = useAuth();

  if (!conversation) return null;

  const otherParticipant = conversation.participants.find(
    (p: any) => p.userId._id !== user?._id
  );

  if (!otherParticipant) return null;

  return (
    <div className="flex items-center justify-between p-[14px] border-b border-accent">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={otherParticipant.userId.imageUrl} />
          <AvatarFallback>
            {otherParticipant.userId.username.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{otherParticipant.userId.username}</h3>
          {/* <p className="text-sm text-muted-foreground">
            {otherParticipant.online ? "Online" : "Offline"}
          </p> */}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Phone className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost">
          <Video className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Star conversation</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

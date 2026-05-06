import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/routes/(root)/notifications/partials/hooks/useNotifications";
import { formatTime, getUserInitials } from "@/lib/utils";
import { useRef } from "react";

const TaskAssignedNotificationCard = ({ notification }: { notification: any }) => {
  const { markAsRead } = useNotifications();
  const hasMarkedRead = useRef(false);

  const handleMarkAsRead = async () => {
    if (!notification?.read && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      await markAsRead.mutateAsync({ id: notification._id });
    }
  };

  return (
    <div onMouseEnter={handleMarkAsRead}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-11">
            <AvatarImage src={notification.data.assignedByProfilePicture} />
            <AvatarFallback>{getUserInitials(notification.data.assignedBy)}</AvatarFallback>
          </Avatar>

          <div className="flex-col-1 min-w-0">
            <p className="text-sm text-stone-400 leading-relaxed max-w-[300px]">
              <span className="font-medium text-black dark:text-white">
                {notification.data.assignedBy}
              </span>{" "}
              assigned you a task{" "}
              <span className="font-medium text-black dark:text-white">
                {notification.data.taskTitle}
              </span>
            </p>
            <p className="text-sm text-stone-400">
              {formatTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignedNotificationCard;

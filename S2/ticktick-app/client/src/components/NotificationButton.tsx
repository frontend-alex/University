import InviteNotificationCard from "./cards/notification/InviteNotificationCard";
import TaskAssignedNotificationCard from "./cards/notification/TaskAssignNotificationCard";

import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/routes/(root)/notifications/partials/hooks/useNotifications";
import { PopoverClose } from "@radix-ui/react-popover";


type Filter = "all" | "unread" | "read";

const NotificationButton = () => {
  const { notifications } = useNotifications();
  const [filter, setFilter] = useState<Filter>("all");

  const hasUnreadNotifications = notifications.some((n) => !n.read);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true; 
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell
            className="text-stone-400 hover:text-stone-600 transition-colors"
            size={18}
          />
          {hasUnreadNotifications && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 shadow-lg border-0" align="end">
        {/* Header */}
        <div className="border-b border-accent p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <PopoverClose asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </PopoverClose>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="border-b border-accent p-4">
          <div className="flex items-center justify-start gap-3">
            {(["all", "unread", "read"] as Filter[]).map((type) => (
              <Button
                key={type}
                size="sm"
                variant={"ghost"}
                onClick={() => setFilter(type)}
                className={`${
                  filter === type ? "bg-accent" : ""
                } w-16 h-7 capitalize`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="max-h-96 overflow-y-auto divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="flex-col-1 p-8 text-center">
              <div className="size-11 mx-auto rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                <Bell className="w-6 h-6 text-stone-400" />
              </div>
              <h4 className="font-semibold">All caught up!</h4>
              <p className="text-sm text-stone-400">
                No notifications found for this filter
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              switch (notification.type) {
                case "workspace_invite":
                  return (
                    <InviteNotificationCard
                      key={notification._id}
                      invitation={notification}
                    />
                  );
                case "task_assigned":
                  return (
                    <TaskAssignedNotificationCard
                      key={notification._id}
                      notification={notification}
                    />
                  );
                default:
                  return null; 
              }
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;

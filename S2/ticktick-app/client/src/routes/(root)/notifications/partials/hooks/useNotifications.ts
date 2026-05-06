
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useFetchData, usePutData, useDeleteData } from "@/hooks/useFetch";
import { SOCKET_EVENTS } from "@/constants/socketEvents";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationReponse } from "@/types/response";
import { flashTitle } from "@/lib/utils";

export const useNotifications = () => {
  const socket = getSocket();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useFetchData<NotificationReponse>(
    ["notifications"],
    "/workspace/notifications/get-all"
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
      const count = (data?.data?.filter((n) => !n.read).length || 0) + 1;
      flashTitle(`🔔 ${count} new notification${count > 1 ? "s" : ""}!`, 12000);
    };

    const events = [
      SOCKET_EVENTS.NEW_NOTIFICATION,
      SOCKET_EVENTS.WORKSPACE_INVITATION,
      SOCKET_EVENTS.TASK_ASSIGNED,
    ];

    events.forEach((event) => socket.on(event, handleNewNotification));

    return () => {
      events.forEach((event) => socket.off(event, handleNewNotification));
    };
  }, [socket, queryClient]);

  const markAsRead = usePutData<NotificationReponse, { id: string }>(
    ({ id }) => `/workspace/notifications/${id}`,
    {
      invalidateKey: ["notifications"],
    }
  );

  const deleteNotification = useDeleteData<NotificationReponse, { id: string }>(
    ({ id }) => `/workspace/notifications/${id}`,
    {
      invalidateKey: ["notifications"],
    }
  );

  return {
    notifications: data?.data ?? [],
    isLoading,
    error,
    refetch,
    markAsRead,
    deleteNotification,
  };
};

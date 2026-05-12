import { useCallback, useEffect, useMemo } from "react";
import { useFetchData } from "@/hooks/useFetch";
import { ActivityResponse } from "@/types/response";
import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

export const useActivityLog = (workspaceId: string | null) => {
  const socket = getSocket();

  const events = useMemo(
    () => [
      SOCKET_EVENTS.NEW_LIST,
      SOCKET_EVENTS.LIST_UPDATED,
      SOCKET_EVENTS.LIST_DELETED,
      SOCKET_EVENTS.NEW_TASK,
      SOCKET_EVENTS.TASK_UPDATED,
      SOCKET_EVENTS.TASK_SOFT_DELETED,
      SOCKET_EVENTS.TASK_RESTORED,
      SOCKET_EVENTS.TASK_PERM_DELETED,
      SOCKET_EVENTS.MEMBER_JOINED,
      SOCKET_EVENTS.MEMBER_LEFT,
    ],
    []
  );

  const { data, isPending, refetch, error } = useFetchData<ActivityResponse>(
    ["activity-log", workspaceId],
    `/workspace/${workspaceId}/activity-log`
  );

  const handleRefetchActivity = useCallback(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!socket || !workspaceId) return;

    socket.emit(SOCKET_EVENTS.JOIN_WORKSPACE_ROOM, workspaceId);

    events.forEach((event) => socket.on(event, handleRefetchActivity));

    return () => {
      events.forEach((event) => socket.off(event, handleRefetchActivity));
    };
  }, [socket, workspaceId]);

  return {
    activityData: data?.data ?? [],
    isPending,
    error,
    handleRefetchActivity,
  };
};

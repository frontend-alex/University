import { SOCKET_EVENTS } from "@/constants/socketEvents";
import {
  useDeleteData,
  useFetchData,
  usePostData,
  usePutData,
} from "@/hooks/useFetch";
import { getSocket } from "@/lib/socket";
import { BaseResponse } from "@/types/response";
import { Workspace } from "@/types/types";
import { useCallback, useEffect, useMemo } from "react";



const useWorkspace = (workspaceId?: string) => {

  const events = useMemo(
    () => [
      SOCKET_EVENTS.WORKSPACE_UPDATED,
      SOCKET_EVENTS.JOIN_WORKSPACE_AND_PERSIST,
      SOCKET_EVENTS.MEMBER_LEFT,
      SOCKET_EVENTS.MEMBER_JOINED,
    ],
    []
  );

  const socket = getSocket();

  const { data: workspaceIdData, refetch: refetchWorkspaceId } = useFetchData<
    BaseResponse<Workspace>
  >(["workspace", workspaceId], `/workspace/${workspaceId}`);

  const handleListChange = useCallback(() => {
    refetchWorkspaceId();
  }, [refetchWorkspaceId])

  useEffect(() => {
    if (!socket || !workspaceId) return;

    events.forEach((event) => socket.on(event, handleListChange));

    return () => {
      events.forEach((event) => socket.off(event, handleListChange));
    };
  }, []);

  const leaveWorkspace = usePutData(() => `/workspace/${workspaceId}/leave`, {
    invalidateKey: ["auth", "user"],
    onSuccess: () => {
      if (socket && workspaceId) {
        socket.emit(SOCKET_EVENTS.MEMBER_LEFT, workspaceId);
      }
      localStorage.removeItem("activeWorkspaceId");
      handleListChange();
    },
  });

  const inviteUserToWorkspace = usePostData(
    `/workspace/${workspaceId}/invite`,
    {
      invalidateKey: ["auth", "user"],
    }
  );

  const updateWorkspace = usePutData(() => `/workspace/delete-workspace`, {
    invalidateKey: ["auth", "user"],
  });

  const deleteWorkspace = useDeleteData<
    { success: boolean; message: string },
    { id: string }
  >(({ id }) => `/workspace/delete-workspace/${id}`, {
    invalidateKey: ["auth", "user"],
  });

  return {
    leaveWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteUserToWorkspace,

    workspaceIdData: workspaceIdData?.data,
  };
};

export default useWorkspace;

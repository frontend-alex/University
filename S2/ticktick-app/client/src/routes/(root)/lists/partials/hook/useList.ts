import { useEffect, useCallback, useMemo } from "react";
import { ListType } from "@/types/enums";
import {
  ListArrayResponse,
  SingleListResponse,
  List,
} from "@/types/response";
import {
  useDeleteData,
  useFetchData,
  usePostData,
  usePutData,
} from "@/hooks/useFetch";
import { getSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

const SOCKET_EVENT_LIST = [
  SOCKET_EVENTS.MEMBER_JOINED,
  SOCKET_EVENTS.NEW_LIST,
  SOCKET_EVENTS.LIST_UPDATED,
  SOCKET_EVENTS.LIST_DELETED,
  SOCKET_EVENTS.MEMBER_LEFT,
];

export const useLists = (workspaceId: string) => {
  const socket = getSocket();

  const { data, isLoading, error, refetch } = useFetchData<ListArrayResponse>(
    ["lists", workspaceId],
    `/workspace/${workspaceId}/lists`
  );

  const handleListChange = useCallback(() => {
    refetch();
  }, [refetch]);

  const events = useMemo(() => SOCKET_EVENT_LIST, []);

  useEffect(() => {
    if (!socket || !workspaceId) return;

    socket.emit(SOCKET_EVENTS.JOIN_WORKSPACE_ROOM, workspaceId);

    events.forEach((event) => socket.on(event, handleListChange));

    return () => {
      events.forEach((event) => socket.off(event, handleListChange));
    };
  }, [socket, workspaceId, events, handleListChange]);

  const createList = usePostData<
    SingleListResponse,
    { title: string; listType: ListType; workspaceId: string }
  >("/workspace/list", {
    invalidateKey: ["lists", workspaceId],
    onSuccess: (data) => {
      if (data.data && workspaceId) {
        socket?.emit(SOCKET_EVENTS.NEW_LIST, {
          workspaceId,
          list: data.data,
        });
      }
    },
  });

  const updateList = usePutData<
    SingleListResponse,
    { listId: string } & Partial<List>
  >(
    () => `/workspace/list`,
    {
      invalidateKey: ["lists", workspaceId],
      onSuccess: (data) => {
        if (data.data && workspaceId) {
          socket?.emit(SOCKET_EVENTS.LIST_UPDATED, {
            workspaceId,
            updatedList: data.data,
          });
        }
      },
    }
  );

  const deleteList = useDeleteData<SingleListResponse, { id: string }>(
    ({ id }) => `/workspace/list/${id}`,
    {
      invalidateKey: ["lists", workspaceId],
      onSuccess: (data) => {
        if (data.data && workspaceId) {
          socket?.emit(SOCKET_EVENTS.LIST_DELETED, {
            workspaceId,
            deletedList: data.data,
          });
        }
      },
    }
  );

  return {
    lists: data?.data,
    isLoading,
    error,
    refetch,
    createList,
    updateList,
    deleteList,
  };
};

export const useListById = (listId: string) => {
  const { data, isLoading, error, refetch } = useFetchData<SingleListResponse>(
    ["list", listId],
    `/workspace/list/${listId}`
  );

  return {
    list: data,
    isLoading,
    error,
    refetch,
  };
};

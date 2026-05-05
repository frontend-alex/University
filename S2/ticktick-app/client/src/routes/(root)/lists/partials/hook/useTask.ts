import {
  useFetchData,
  usePostData,
  usePutData,
  useDeleteData,
} from "@/hooks/useFetch";
import { getSocket } from "@/lib/socket";
import { useEffect, useCallback, useMemo } from "react";
import {
  Task,
  TaskArrayResponse,
  SingleTaskResponse,
  UserTasksResponse,
} from "@/types/response";
import { SOCKET_EVENTS } from "@/constants/socketEvents";

export const useTasks = (listId?: string, refetchLists?: () => void) => {
  const socket = getSocket();
  const workspaceId = localStorage.getItem("activeWorkspaceId") ?? "";

  const regularTasksQueryKey = useMemo(() => (listId ? ["tasks", listId] : ["tasks"]), [listId]);
  const regularTasksEndpoint = useMemo(() => (listId ? `/workspace/tasks/list/${listId}` : ``), [listId]);

  const trashTasksQueryKey = useMemo(() => ["trash-tasks"], []);
  const trashTasksEndpoint = `/workspace/tasks/deleted`;

  const {
    data: regularTasksData,
    isLoading: regularTasksLoading,
    error: regularTasksError,
    refetch: refetchRegularTasks,
  } = useFetchData<TaskArrayResponse>(regularTasksQueryKey, regularTasksEndpoint);

  const {
    data: trashTasksData,
    isLoading: trashTasksLoading,
    error: trashTasksError,
    refetch: refetchTrashTasks,
  } = useFetchData<TaskArrayResponse>(trashTasksQueryKey, trashTasksEndpoint);

  const allUserTasksQueryKey = useMemo(() => ["user-tasks", workspaceId], [workspaceId]);
  const allUserTasksEndpoint = `/workspace/tasks/all-tasks`;

  const {
    data: allUserTasksData,
    isLoading: isAllUserTasksLoading,
    error: allUserTasksError,
    refetch: refetchAllUserTasks,
  } = useFetchData<UserTasksResponse>(allUserTasksQueryKey, allUserTasksEndpoint);

  const handleTaskUpdates = useCallback(() => {
    refetchRegularTasks();
    refetchTrashTasks();
    refetchLists?.();
    refetchAllUserTasks();
  }, [refetchRegularTasks, refetchTrashTasks, refetchLists, refetchAllUserTasks]);

  const events = useMemo(
    () => [
      SOCKET_EVENTS.NEW_TASK,
      SOCKET_EVENTS.TASK_UPDATED,
      SOCKET_EVENTS.TASK_SOFT_DELETED,
      SOCKET_EVENTS.TASK_RESTORED,
      SOCKET_EVENTS.TASK_PERM_DELETED,
    ],
    []
  );

  useEffect(() => {
    if (!socket || !workspaceId) return;

    socket.emit(SOCKET_EVENTS.JOIN_WORKSPACE_ROOM, workspaceId);

    events.forEach((event) => socket.on(event, handleTaskUpdates));
    return () => events.forEach((event) => socket.off(event, handleTaskUpdates));
  }, [socket, workspaceId, events, handleTaskUpdates]);

  const createTask = usePostData<SingleTaskResponse, Partial<Task>>(
    `/workspace/task`,
    {
      invalidateKey: regularTasksQueryKey,
      onSuccess: (res) => {
        if (res.data && workspaceId) {
          socket?.emit(SOCKET_EVENTS.NEW_TASK, { workspaceId, task: res.data });
        }
        handleTaskUpdates();
      },
    }
  );

  const updateTask = usePutData<SingleTaskResponse, { id: string } & Partial<Task>>(
    ({ id }) => `/workspace/task/${id}`,
    {
      invalidateKey: regularTasksQueryKey,
      onSuccess: (res) => {
        if (res.data && workspaceId) {
          socket?.emit(SOCKET_EVENTS.TASK_UPDATED, { workspaceId, task: res.data });
        }
        handleTaskUpdates();
      },
    }
  );

  const softDeleteTask = useDeleteData<SingleTaskResponse, { id: string }>(
    ({ id }) => `/workspace/task/${id}/soft`,
    {
      invalidateKey: [...regularTasksQueryKey, ...trashTasksQueryKey],
      onSuccess: (res) => {
        if (workspaceId && res.data) {
          socket?.emit(SOCKET_EVENTS.TASK_SOFT_DELETED, { workspaceId, taskId: res.data._id });
        }
        handleTaskUpdates();
      },
    }
  );

  const restoreTask = usePutData<SingleTaskResponse, { id: string }>(
    ({ id }) => `/workspace/task/${id}/restore`,
    {
      invalidateKey: [...regularTasksQueryKey, ...trashTasksQueryKey],
      onSuccess: (res) => {
        if (workspaceId && res.data) {
          socket?.emit(SOCKET_EVENTS.TASK_RESTORED, { workspaceId, task: res.data });
        }
        handleTaskUpdates();
      },
    }
  );

  const permanentlyDeleteTask = useDeleteData<SingleTaskResponse, { id: string }>(
    ({ id }) => `/workspace/task/${id}`,
    {
      invalidateKey: trashTasksQueryKey,
      onSuccess: (res) => {
        if (workspaceId && res.data) {
          socket?.emit(SOCKET_EVENTS.TASK_PERM_DELETED, { workspaceId, taskId: res.data._id });
        }
        handleTaskUpdates();
      },
    }
  );

  const selectedTask = (tasks: Task[], selectedTaskId: string | null) => {
    if (!selectedTaskId) return null;
    return tasks.find((task) => task._id === selectedTaskId) || null;
  };

  return {
    tasks: regularTasksData?.data ?? [],
    isLoading: regularTasksLoading,
    error: regularTasksError,
    refetchTasks: refetchRegularTasks,

    trashTasks: trashTasksData?.data ?? [],
    isTrashLoading: trashTasksLoading,
    trashError: trashTasksError,
    refetchTrashTasks,

    userAssignedTasks: allUserTasksData?.data.assignedTasks ?? [],
    userListTasks: allUserTasksData?.data.listTasks ?? [],
    isAllUserTasksLoading,
    allUserTasksError,
    refetchAllUserTasks,

    createTask,
    updateTask,
    softDeleteTask,
    restoreTask,
    permanentlyDeleteTask,
    selectedTask,
  };
};

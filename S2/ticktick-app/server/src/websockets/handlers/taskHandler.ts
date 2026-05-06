import { Server } from "socket.io";
import { AuthenticatedSocket } from "../socketServer";
import { SOCKET_EVENTS } from "../../constants/socketEvents";
import { ActivityRepository } from "../../repositories/workspace/activityRepository";

const activityRepository = new ActivityRepository();

export const registerTaskHandler = (
  socket: AuthenticatedSocket,
  io: Server
) => {
  const user = socket.user;

  socket.on(SOCKET_EVENTS.NEW_TASK, async ({ workspaceId, task }) => {
    io.to(workspaceId).emit(SOCKET_EVENTS.NEW_TASK, task);
    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `created task "${task.title}"`,
      entityType: "task",
      entityId: task._id,
      entityTitle: task.title,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });

  socket.on(SOCKET_EVENTS.TASK_UPDATED, async ({ workspaceId, task }) => {
    io.to(workspaceId).emit(SOCKET_EVENTS.TASK_UPDATED, task);
    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `updated task "${task.title}"`,
      entityType: "task",
      entityId: task._id,
      entityTitle: task.title,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });

  socket.on(
    SOCKET_EVENTS.TASK_SOFT_DELETED,
    async ({ workspaceId, taskId }) => {
      io.to(workspaceId).emit(SOCKET_EVENTS.TASK_SOFT_DELETED, { taskId });
      const log = await activityRepository.logActivity({
        workspaceId,
        user,
        action: `soft-deleted a task`,
        entityType: "task",
        entityId: taskId,
      });
      io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
    }
  );

  socket.on(SOCKET_EVENTS.TASK_RESTORED, async ({ workspaceId, task }) => {
    io.to(workspaceId).emit(SOCKET_EVENTS.TASK_RESTORED, task);
    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `restored task "${task.title}"`,
      entityType: "task",
      entityId: task._id,
      entityTitle: task.title,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });

  socket.on("taskPermanentlyDeleted", async ({ workspaceId, taskId }) => {
    io.to(workspaceId).emit("taskPermanentlyDeleted", { taskId });
    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `permanently deleted a task`,
      entityType: "task",
      entityId: taskId,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });
};

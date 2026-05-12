import { Types } from "mongoose";
import { Server } from "socket.io";
import { AuthenticatedSocket } from "../socketServer";
import { ListRepository } from "../../repositories/workspace/listRepository";
import { ActivityRepository } from "../../repositories/workspace/activityRepository";
import { SOCKET_EVENTS } from "../../constants/socketEvents";

const activityRepository = new ActivityRepository();
const listRepository = new ListRepository();

export const registerListHandler = (
  socket: AuthenticatedSocket,
  io: Server
) => {
  const user = socket.user;

  socket.on(SOCKET_EVENTS.NEW_LIST, async ({ workspaceId, list }) => {
    io.to(workspaceId).emit(SOCKET_EVENTS.NEW_LIST, list);

    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `created list "${list.title}"`,
      entityType: "list",
      entityId: list._id,
      entityTitle: list.title,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });

  socket.on(SOCKET_EVENTS.LIST_UPDATED, async ({ workspaceId, updatedList }) => {
    try {
      const fullList = await listRepository.getListById(updatedList._id);

      if (!fullList) return;

      io.to(workspaceId).emit(SOCKET_EVENTS.LIST_UPDATED, fullList);

      const log = await activityRepository.logActivity({
        workspaceId,
        user,
        action: `updated list "${fullList.title}"`,
        entityType: "list",
        entityId: fullList._id as unknown as Types.ObjectId,
        entityTitle: fullList.title,
      });

      io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
    } catch (error) {
      console.error("Error handling listUpdated:", error);
    }
  });

  socket.on(SOCKET_EVENTS.LIST_DELETED, async ({ workspaceId, deletedList }) => {
    io.to(workspaceId).emit(SOCKET_EVENTS.LIST_DELETED, deletedList);

    const log = await activityRepository.logActivity({
      workspaceId,
      user,
      action: `deleted list "${deletedList.title}"`,
      entityType: "list",
      entityId: deletedList._id,
      entityTitle: deletedList.title,
    });
    io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
  });
};

import { Types } from "mongoose";
import { Server } from "socket.io";
import { WorkspaceType } from "../../types/Enums";
import { AuthenticatedSocket } from "../socketServer";
import { UserRepository } from "../../repositories/user/userRepository";
import { WorkspaceRepository } from "../../repositories/workspace/workspaceRepository";
import { ActivityRepository } from "../../repositories/workspace/activityRepository";
import { SOCKET_EVENTS } from "../../constants/socketEvents";

const userRepository = new UserRepository();
const workspaceRepository = new WorkspaceRepository();
const activityRepository = new ActivityRepository();

export const registerWorkspaceHandlers = (
  socket: AuthenticatedSocket,
  io: Server
) => {
  const user = socket.user;
  socket.join(user.id);

  socket.on(SOCKET_EVENTS.JOIN_WORKSPACE_ROOM, (workspaceId: string) => {
    socket.join(workspaceId);
  });

  socket.on(
    SOCKET_EVENTS.JOIN_WORKSPACE_AND_PERSIST,
    async (workspaceId: string) => {
      const workspace = await workspaceRepository.getWorkspaceById(workspaceId);
      const isAlreadyMember = workspace?.members.some(
        (member: any) => member.user.toString() === user.id.toString()
      );

      if (!isAlreadyMember) {
        await workspaceRepository.update(
          { _id: workspaceId },
          {
            $set: {
              type: WorkspaceType.Team,
            },
            $addToSet: {
              members: {
                user: user.id,
                role: "member",
                joinedAt: new Date(),
              },
            },
          }
        );

        await userRepository.update(
          {
            _id: user.id,
            workspaces: { $ne: new Types.ObjectId(workspaceId) },
          },
          {
            $addToSet: {
              workspaces: new Types.ObjectId(workspaceId),
            },
          }
        );

        io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_MEMBER_JOINED, {
          workspaceId,
          newMember: {
            id: user.id,
            username: user.username,
          },
        });

        const log = await activityRepository.logActivity({
          workspaceId,
          user,
          action: "joined the workspace",
          entityType: "workspace",
        });

        io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);
      }

      socket.join(workspaceId);
    }
  );

  socket.on(
    SOCKET_EVENTS.WORKSPACE_MEMBER_LEFT,
    async (workspaceId: string) => {
      try {
        const updatedWorkspace = await workspaceRepository.removeMember(
          workspaceId,
          user.id
        );

        if (!updatedWorkspace) return;

        if (updatedWorkspace.members.length === 1) {
          await workspaceRepository.update(
            { _id: workspaceId },
            { $set: { type: WorkspaceType.Personal } }
          );

          const refreshed = await workspaceRepository.getWorkspaceById(
            workspaceId
          );
          io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_UPDATED, refreshed);
        }

        io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_MEMBER_LEFT, {
          workspaceId,
          user: {
            id: user.id,
            username: user.username,
          },
        });

        const log = await activityRepository.logActivity({
          workspaceId,
          user,
          action: "left the workspace",
          entityType: "workspace",
        });

        io.to(workspaceId).emit(SOCKET_EVENTS.WORKSPACE_ACTIVITY, log);

        socket.leave(workspaceId);
      } catch (error) {
        console.error("Error handling workspaceMemberLeft:", error);
      }
    }
  );

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {});
};

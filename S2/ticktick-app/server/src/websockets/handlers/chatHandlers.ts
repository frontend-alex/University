import { Server } from "socket.io";
import { AuthenticatedSocket } from "../socketServer";
import { MessageService } from "../../services/chat/messageService";
import { SOCKET_EVENTS } from "../../constants/socketEvents";
import { UserService } from "../../services/user/userService";
import { IUser } from "../../models/user";
import { createError } from "../../middleware/errorHandler";

const userService = new UserService();

export const registerChatHandlers = async (
  socket: AuthenticatedSocket,
  io: Server
) => {
  const user = (await userService.getUserId(socket.user.id)) as IUser;

  if (!user) {
    return createError("USER_NOT_FOUND");
  }

  const messageService = new MessageService();

  socket.join(`user:${user.id}`);

  socket.on(
    SOCKET_EVENTS.DIRECT_MESSAGE,
    async ({ toUserId, workspaceId, chatId, content }) => {
      try {
        if (toUserId === user.id) return;

        io.to(`user:${toUserId}`).emit(SOCKET_EVENTS.NEW_DIRECT_MESSAGE, {
          chatId,
          fromUser: {
            username: user.username,
            imageUrl: user.imageUrl,
            _id: user.id,
          },
          content,
          workspaceId,
        });

        console.log("Sent NEW_DIRECT_MESSAGE to:", toUserId);
      } catch (err) {
        console.error("Socket Error in directMessage:", err);
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.MARK_AS_READ,
    async ({ conversationId, toUserId }) => {
      try {
        await messageService.markAsRead(conversationId, user.id);
        io.to(`user:${toUserId}`).emit(SOCKET_EVENTS.MARK_AS_READ);
        io.to(`user:${user.id}`).emit(SOCKET_EVENTS.MARK_AS_READ);
      } catch (err) {
        console.error("Socket Error in markAsRead:", err);
      }
    }
  );

  socket.on(SOCKET_EVENTS.TYPING, ({ toUserId, conversationId }) => {
    if (toUserId !== user.id) {
      io.to(`user:${toUserId}`).emit(SOCKET_EVENTS.TYPING, {
        conversationId,
        fromUserId: user.id,
      });
    }
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ toUserId, conversationId }) => {
    if (toUserId !== user.id) {
      io.to(`user:${toUserId}`).emit(SOCKET_EVENTS.STOP_TYPING, {
        conversationId,
        fromUserId: user.id,
      });
    }
  });
};

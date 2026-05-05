import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { logger } from "../services/loggerService";
import { JwtUtils } from "../utils/jwt/jwtUtils";
import { registerChatHandlers } from "./handlers/chatHandlers";
import { registerListHandler } from "./handlers/listHandler";
import { registerTaskHandler } from "./handlers/taskHandler";
import { registerWorkspaceHandlers } from "./handlers/workspaceHandlers";
import { DecodedUser } from "../middleware/jwtMiddleware";
import { config } from "../config/config";


export interface AuthenticatedSocket extends Socket {
  user: DecodedUser;
}

let io: Server;

export const setupSocketServer = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: config.URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      logger.warn("Socket authentication failed: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = JwtUtils.verifyToken(token) as DecodedUser;
      (socket as AuthenticatedSocket).user = decoded;
      next();
    } catch (err) {
      logger.error("Socket authentication failed: Invalid token");
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    // logger.info(
    //   `🔌 New client connected: ${authSocket.id} (${authSocket.user.username})`
    // );

    registerWorkspaceHandlers(authSocket, io);
    registerListHandler(authSocket, io);
    registerTaskHandler(authSocket, io);
    registerChatHandlers(authSocket, io);

    authSocket.on("disconnect", () => {
      // logger.info(`🔌 Client disconnected: ${authSocket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

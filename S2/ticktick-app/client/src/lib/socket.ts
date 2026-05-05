import { config } from "@/config/config";
import io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = (token: string) => {
  socket = io(config.URL || "http://localhost:3000", {
    auth: {
      token,
    },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
  });

  socket.on("disconnect", () => {
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

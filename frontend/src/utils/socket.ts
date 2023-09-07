import io from "socket.io-client";
import { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const connectSocket = () => {
  if (!socketInstance) {
    socketInstance = io("ws://localhost:6001");
  }
  return socketInstance;
};

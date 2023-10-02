import io from "socket.io-client";
import { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const connectSocket = () => {
  if (!socketInstance) {
    socketInstance = io("ws://192.168.43.200:6001");
  }
  return socketInstance;
};

import io from "socket.io-client";
import { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const connectSocket = () => {
  if (!socketInstance) {
    const ip1 = "192.168.43.126";
    const ip2 = "192.168.43.200";
    const ip3 = "192.168.215.126";
    const ip4 = "10.32.7.208";
    const local = "localhost";
    const apiUrl = "api-chess-arena.vercel.app";

    socketInstance = io(local, {
      transports: ["websocket"],
    });
  }
  return socketInstance;
};

import io from "socket.io-client";
import { Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const connectSocket = () => {
  if (!socketInstance) {
    const ip1 = "192.168.43.126";
    const ip2 = "192.168.43.200";

    socketInstance = io(`ws://${ip2}:6001`);

  }
  return socketInstance;
};

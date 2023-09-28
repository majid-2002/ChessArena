"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { connectSocket } from "@/utils/socket"; // Import your socket connection function here

const SocketContext = createContext(connectSocket());

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: any) {
  const [socket, setSocket] = useState(connectSocket());

  useEffect(() => {
    const newSocket = connectSocket();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

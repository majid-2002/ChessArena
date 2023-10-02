"use client";

import { createContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null; 
};

// Create the SocketContext with the specified type
export const SocketContext = createContext<SocketContextType>({ socket: null });
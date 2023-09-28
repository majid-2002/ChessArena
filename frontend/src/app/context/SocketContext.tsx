"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { connectSocket } from "@/utils/socket"; // Import your socket connection function here

const SocketContext = createContext(connectSocket());

export default SocketContext;

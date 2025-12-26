"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { HomeState } from "@/types";

interface WebSocketContextType {
  homeState: HomeState;
  isConnected: boolean;
  connectionError: string | null;
  reconnectAttempt: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const webSocketData = useWebSocket();

  return (
    <WebSocketContext.Provider value={webSocketData}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
}

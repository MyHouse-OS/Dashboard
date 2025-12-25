"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { HomeState, WSMessage, EventType } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://192.168.4.2:3000/ws";

export function useWebSocket() {
  const [homeState, setHomeState] = useState<HomeState>({
    temperature: "0",
    light: false,
    door: false,
    heat: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    isConnectingRef.current = true;
    setConnectionError(null);

    try {
      console.log(`[WS] Connecting to ${WS_URL}...`);
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("[WS] Connected successfully");
        isConnectingRef.current = false;
        setIsConnected(true);
        setReconnectAttempt(0);
        setConnectionError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          console.log("[WS] Message received:", message.type);

          if (message.type === "INIT") {
            // Initial state received
            setHomeState(message.data as HomeState);
          } else if (message.type === "UPDATE") {
            // State update received - matches eventBus.emit(EVENTS.STATE_CHANGE, { type, value })
            const update = message.data as { type: EventType; value: string };
            console.log("[WS] State update:", update.type, "=", update.value);

            setHomeState((prev) => {
              const newState = { ...prev };

              switch (update.type) {
                case "TEMPERATURE":
                  newState.temperature = update.value;
                  break;
                case "LIGHT":
                  newState.light = update.value === "true";
                  break;
                case "DOOR":
                  newState.door = update.value === "true";
                  break;
                case "HEAT":
                  newState.heat = update.value === "true";
                  break;
              }

              return newState;
            });
          }
        } catch (error) {
          console.error("[WS] Error parsing message:", error);
        }
      };

      ws.onerror = () => {
        // WebSocket error events don't contain useful info in browsers
        // The actual error will be logged in onclose
        console.warn("[WS] Connection error occurred");
        isConnectingRef.current = false;
        setConnectionError("Connection error - server may be unreachable");
      };

      ws.onclose = (event) => {
        console.log(
          `[WS] Disconnected (code: ${event.code}, reason: ${
            event.reason || "none"
          })`
        );
        isConnectingRef.current = false;
        setIsConnected(false);
        wsRef.current = null;

        // Provide more helpful error messages based on close code
        if (event.code === 1006) {
          setConnectionError(
            "Connection lost - server unreachable or CORS issue"
          );
        } else if (event.code !== 1000) {
          setConnectionError(`Connection closed (code: ${event.code})`);
        }

        // Attempt to reconnect with exponential backoff
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
        console.log(
          `[WS] Reconnecting in ${timeout}ms (attempt ${reconnectAttempt + 1})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempt((prev) => prev + 1);
          connect();
        }, timeout);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[WS] Error creating WebSocket:", error);
      isConnectingRef.current = false;
      setConnectionError(
        error instanceof Error ? error.message : "Failed to create WebSocket"
      );
    }
  }, [reconnectAttempt]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, [connect]);

  return { homeState, isConnected, connectionError, reconnectAttempt };
}

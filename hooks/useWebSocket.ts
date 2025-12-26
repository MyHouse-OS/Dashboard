"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
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
            setHomeState(message.data as HomeState);
          } else if (message.type === "UPDATE") {
            const update = message.data as { type: EventType; value: string };
            console.log("[WS] State update:", update.type, "=", update.value);

            setHomeState((prev) => {
              const newState = { ...prev };
              const prevTemp = parseFloat(prev.temperature) || 0;

              switch (update.type) {
                case "TEMPERATURE":
                  newState.temperature = update.value;
                  const newTemp = parseFloat(update.value) || 0;

                  if (Math.abs(newTemp - prevTemp) > 2 && prevTemp !== 0) {
                    const toastId = `temp-${newTemp}`;
                    if (newTemp > prevTemp) {
                      toast.success("Température en hausse", {
                        id: toastId,
                        description: `${prevTemp.toFixed(1)}°C → ${newTemp.toFixed(1)}°C`,
                        duration: 5000,
                      });
                    } else {
                      toast.info("Température en baisse", {
                        id: toastId,
                        description: `${prevTemp.toFixed(1)}°C → ${newTemp.toFixed(1)}°C`,
                        duration: 5000,
                      });
                    }
                  }
                  break;

                case "LIGHT":
                  newState.light = update.value === "true";
                  const lightId = `light-${update.value}`;
                  if (update.value === "true") {
                    toast.success("💡 Lumière allumée", {
                      id: lightId,
                      description: "Éclairage activé",
                      duration: 4000,
                    });
                  } else {
                    toast.info("💡 Lumière éteinte", {
                      id: lightId,
                      description: "Éclairage désactivé",
                      duration: 4000,
                    });
                  }
                  break;

                case "DOOR":
                  newState.door = update.value === "true";
                  const doorId = `door-${update.value}`;
                  if (update.value === "true") {
                    toast.success("🚪 Porte ouverte", {
                      id: doorId,
                      description: "Accès détecté",
                      duration: 4000,
                    });
                    if (prev.heat) {
                      toast.warning("⚠️ Porte ouverte avec chauffage actif", {
                        id: "door-heat-warning",
                        description: "Pensez à fermer la porte pour économiser l'énergie",
                        duration: 7000,
                      });
                    }
                  } else {
                    toast.info("🚪 Porte fermée", {
                      id: doorId,
                      description: "Accès sécurisé",
                      duration: 4000,
                    });
                  }
                  break;

                case "HEAT":
                  newState.heat = update.value === "true";
                  const heatId = `heat-${update.value}`;
                  if (update.value === "true") {
                    toast.success("🔥 Chauffage activé", {
                      id: heatId,
                      description: `Mode confort - Température actuelle: ${prevTemp.toFixed(1)}°C`,
                      duration: 5000,
                    });
                    if (prevTemp >= 25) {
                      toast.warning("🌡️ Température élevée détectée", {
                        id: "heat-temp-warning",
                        description: `${prevTemp.toFixed(1)}°C - Le chauffage pourrait être inutile`,
                        duration: 7000,
                      });
                    }
                  } else {
                    toast.info("🔥 Chauffage désactivé", {
                      id: heatId,
                      description: `Mode éco - Température actuelle: ${prevTemp.toFixed(1)}°C`,
                      duration: 5000,
                    });
                  }
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

        if (event.code === 1006) {
          setConnectionError(
            "Connection lost - server unreachable or CORS issue"
          );
        } else if (event.code !== 1000) {
          setConnectionError(`Connection closed (code: ${event.code})`);
        }

        setReconnectAttempt((prev) => {
          const nextAttempt = prev + 1;
          const timeout = Math.min(1000 * Math.pow(2, prev), 30000);
          console.log(
            `[WS] Reconnecting in ${timeout}ms (attempt ${nextAttempt})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, timeout);

          return nextAttempt;
        });
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[WS] Error creating WebSocket:", error);
      isConnectingRef.current = false;
      setConnectionError(
        error instanceof Error ? error.message : "Failed to create WebSocket"
      );
    }
  }, []);

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

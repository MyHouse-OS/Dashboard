"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  reconnectAttempt?: number;
  connectionError?: string | null;
}

export function ConnectionStatus({
  isConnected,
  reconnectAttempt = 0,
  connectionError,
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <Badge
        variant="outline"
        className="gap-2 border-green-500/50 bg-green-500/10 text-green-500 glow-cyan"
      >
        <Wifi className="h-3 w-3 animate-pulse" />
        Connected
      </Badge>
    );
  }

  const badge = (
    <Badge
      variant="outline"
      className="gap-2 border-red-500/50 bg-red-500/10 text-red-500"
    >
      <WifiOff className="h-3 w-3" />
      {reconnectAttempt > 0
        ? `Reconnecting... (${reconnectAttempt})`
        : "Disconnected"}
    </Badge>
  );

  if (connectionError) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{connectionError}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badge;
}

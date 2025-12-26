"use client";

import { useState, useEffect, useRef } from "react";
import type { HomeState } from "@/types";

export interface PresenceStatus {
  isPresent: boolean;
  confidence: "low" | "medium" | "high";
  reason: string;
  lastActivity: Date | null;
}

export function usePresenceDetection(homeState: HomeState): PresenceStatus {
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus>({
    isPresent: false,
    confidence: "low",
    reason: "En attente de données...",
    lastActivity: null,
  });

  const previousStateRef = useRef<HomeState>(homeState);
  const lastActivityRef = useRef<Date>(new Date());

  useEffect(() => {
    const prev = previousStateRef.current;
    let activityDetected = false;

    if (
      prev.light !== homeState.light ||
      prev.door !== homeState.door ||
      prev.heat !== homeState.heat
    ) {
      activityDetected = true;
      lastActivityRef.current = new Date();
    }

    const prevTemp = parseFloat(prev.temperature) || 0;
    const currentTemp = parseFloat(homeState.temperature) || 0;
    if (Math.abs(currentTemp - prevTemp) > 0.5) {
      activityDetected = true;
      lastActivityRef.current = new Date();
    }

    previousStateRef.current = homeState;

    let presenceScore = 0;
    const reasons: string[] = [];

    if (homeState.light) {
      presenceScore += 40;
      reasons.push("lumière allumée");
    }

    if (homeState.door) {
      presenceScore += 20;
      reasons.push("porte ouverte");
    }

    if (homeState.heat) {
      presenceScore += 30;
      reasons.push("chauffage actif");
    }

    const temp = parseFloat(homeState.temperature) || 0;
    if (temp >= 19 && temp <= 23) {
      presenceScore += 10;
    }

    const timeSinceActivity = Date.now() - lastActivityRef.current.getTime();
    const minutesSinceActivity = timeSinceActivity / (1000 * 60);

    if (minutesSinceActivity < 5 && activityDetected) {
      presenceScore += 20;
      reasons.push("activité détectée");
    }

    let isPresent = false;
    let confidence: "low" | "medium" | "high" = "low";
    let reason = "";

    if (presenceScore >= 70) {
      isPresent = true;
      confidence = "high";
      reason = `Présence confirmée (${reasons.join(", ")})`;
    } else if (presenceScore >= 40) {
      isPresent = true;
      confidence = "medium";
      reason = `Présence probable (${reasons.join(", ")})`;
    } else if (presenceScore >= 20) {
      isPresent = true;
      confidence = "low";
      reason = `Présence possible (${reasons.join(", ")})`;
    } else {
      isPresent = false;
      confidence = "low";
      reason = "Aucune activité détectée";
    }

    setPresenceStatus({
      isPresent,
      confidence,
      reason,
      lastActivity: lastActivityRef.current,
    });
  }, [homeState]);

  return presenceStatus;
}

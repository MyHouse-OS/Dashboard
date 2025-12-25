"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toggleHeat, toggleLight, toggleDoor, getHistory } from "@/lib/api";
import type { HistoryEvent } from "@/types";
import {
  Thermometer,
  Lightbulb,
  DoorOpen,
  Flame,
  Plus,
  Minus,
  Users,
  Activity,
  MoreVertical,
} from "lucide-react";

export default function DashboardPage() {
  const { homeState } = useWebSocket();
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const temperature = parseFloat(homeState.temperature) || 0;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const handleToggle = async (type: "light" | "door" | "heat") => {
    setIsToggling(type);
    try {
      switch (type) {
        case "light":
          await toggleLight();
          break;
        case "door":
          await toggleDoor();
          break;
        case "heat":
          await toggleHeat();
          break;
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Température
            </CardTitle>
            <Thermometer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {temperature.toFixed(1)}°C
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {homeState.heat ? "Chauffage actif" : "Chauffage inactif"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lumière
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {homeState.light ? "ON" : "OFF"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {homeState.light ? "Allumée" : "Éteinte"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Porte
            </CardTitle>
            <DoorOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {homeState.door ? "OPEN" : "CLOSED"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {homeState.door ? "Ouverte" : "Fermée"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chauffage
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {homeState.heat ? "ON" : "OFF"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {homeState.heat ? "Actif" : "Inactif"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Heating Control */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Chauffage
            </CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temperature Gauge */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="h-48 w-48 -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(temperature / 30) * 502} 502`}
                    className="text-blue-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {temperature.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {homeState.heat ? "Chauffage allumé" : "Chauffage éteint"}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mode</span>
                  <Badge variant={homeState.heat ? "default" : "secondary"}>
                    {homeState.heat ? "Confort" : "Eco"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Température cible : 21.5°C
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">21.5°C</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2">
                <Flame
                  className={`h-5 w-5 ${
                    homeState.heat ? "text-orange-500" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">Chauffage</span>
              </div>
              <Switch
                checked={homeState.heat}
                onCheckedChange={() => handleToggle("heat")}
                disabled={isToggling === "heat"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Presence & Controls */}
        <div className="space-y-6">
          {/* Presence Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Présence
              </CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-4">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Maison occupée</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Mouvements détectés
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                Contrôles rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      homeState.light ? "bg-yellow-500/20" : "bg-gray-500/20"
                    }`}
                  >
                    <Lightbulb
                      className={`h-5 w-5 ${
                        homeState.light ? "text-yellow-500" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">Lumière</div>
                    <div className="text-sm text-muted-foreground">
                      {homeState.light ? "Allumée" : "Éteinte"}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={homeState.light}
                  onCheckedChange={() => handleToggle("light")}
                  disabled={isToggling === "light"}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      homeState.door ? "bg-green-500/20" : "bg-gray-500/20"
                    }`}
                  >
                    <DoorOpen
                      className={`h-5 w-5 ${
                        homeState.door ? "text-green-500" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">Porte</div>
                    <div className="text-sm text-muted-foreground">
                      {homeState.door ? "Ouverte" : "Fermée"}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={homeState.door}
                  onCheckedChange={() => handleToggle("door")}
                  disabled={isToggling === "door"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Programming Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Programmation du Chauffage</CardTitle>
            <Button size="sm" variant="outline">
              Ajouter un programme
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            Calendrier de programmation (à implémenter)
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Historique des états
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsLoadingHistory(true);
                getHistory()
                  .then((res) => setHistory(res.data))
                  .finally(() => setIsLoadingHistory(false));
              }}
            >
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun événement
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((event) => {
                const getEventIcon = () => {
                  switch (event.type) {
                    case "LIGHT":
                      return (
                        <Lightbulb
                          className={`h-4 w-4 ${
                            event.value === "true"
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }`}
                        />
                      );
                    case "DOOR":
                      return (
                        <DoorOpen
                          className={`h-4 w-4 ${
                            event.value === "true"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                      );
                    case "HEAT":
                      return (
                        <Flame
                          className={`h-4 w-4 ${
                            event.value === "true"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        />
                      );
                    case "TEMPERATURE":
                      return <Thermometer className="h-4 w-4 text-blue-500" />;
                    default:
                      return <Activity className="h-4 w-4" />;
                  }
                };

                const getEventLabel = () => {
                  switch (event.type) {
                    case "LIGHT":
                      return event.value === "true"
                        ? "Lumière allumée"
                        : "Lumière éteinte";
                    case "DOOR":
                      return event.value === "true"
                        ? "Porte ouverte"
                        : "Porte fermée";
                    case "HEAT":
                      return event.value === "true"
                        ? "Chauffage activé"
                        : "Chauffage désactivé";
                    case "TEMPERATURE":
                      return `Température: ${event.value}°C`;
                    default:
                      return `${event.type}: ${event.value}`;
                  }
                };

                const getEventColor = () => {
                  switch (event.type) {
                    case "LIGHT":
                      return event.value === "true"
                        ? "bg-yellow-500/10 border-yellow-500/20"
                        : "bg-gray-500/10 border-gray-500/20";
                    case "DOOR":
                      return event.value === "true"
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-gray-500/10 border-gray-500/20";
                    case "HEAT":
                      return event.value === "true"
                        ? "bg-orange-500/10 border-orange-500/20"
                        : "bg-gray-500/10 border-gray-500/20";
                    case "TEMPERATURE":
                      return "bg-blue-500/10 border-blue-500/20";
                    default:
                      return "bg-gray-500/10 border-gray-500/20";
                  }
                };

                return (
                  <div
                    key={event.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${getEventColor()}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-background/50 p-2">
                        {getEventIcon()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {getEventLabel()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{event.id}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

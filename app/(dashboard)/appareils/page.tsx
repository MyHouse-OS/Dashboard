"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Server, Radio, Settings, Link2 as LinkIcon } from "lucide-react";
import type { Device } from "@/types";

const mockDevices: Device[] = [
  {
    id: "1",
    name: "ESP32 Server",
    type: "Contrôleur Principal",
    status: "online",
    ip: process.env.NEXT_PUBLIC_SERVER_IP || "192.168.4.1",
  },
  {
    id: "2",
    name: "ESP32 Client 1",
    type: "Salon",
    status: "online",
    ip: process.env.NEXT_PUBLIC_CLIENT1_IP || "192.168.4.3",
  },
  {
    id: "3",
    name: "ESP32 Client 2",
    type: "Chambre",
    status: "online",
    ip: process.env.NEXT_PUBLIC_CLIENT2_IP || "192.168.4.4",
  },
];

export default function AppareilsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [devices] = useState<Device[]>(mockDevices);

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery)
  );

  const getDeviceIcon = (type: string) => {
    if (type.includes("Principal")) return Server;
    return Radio;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appareils</h2>
          <p className="text-muted-foreground">
            Gérez vos appareils connectés à MyHouse OS
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Plus className="h-4 w-4" />
          Ajouter un appareil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Appareils</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un appareil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Appareil</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">IP</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => {
                  const Icon = getDeviceIcon(device.type);
                  return (
                    <tr
                      key={device.id}
                      className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${
                        index === filteredDevices.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`rounded-lg p-3 ${
                                device.type.includes("Principal")
                                  ? "bg-blue-500/10"
                                  : "bg-cyan-500/10"
                              }`}
                            >
                              <Icon
                                className={`h-6 w-6 ${
                                  device.type.includes("Principal")
                                    ? "text-blue-500"
                                    : "text-cyan-500"
                                }`}
                              />
                            </div>
                            {device.status === "online" && (
                              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{device.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ({device.type})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={device.status === "online" ? "default" : "secondary"}
                          className={
                            device.status === "online"
                              ? "border-green-500/50 bg-green-500/10 text-green-500"
                              : "border-red-500/50 bg-red-500/10 text-red-500"
                          }
                        >
                          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                          {device.status === "online" ? "En ligne" : "Hors ligne"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {device.ip}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {device.type.includes("Principal") ? (
                            <Button size="sm" variant="outline" className="gap-2">
                              <LinkIcon className="h-4 w-4" />
                              Gérer les Liens
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="gap-2">
                              <Settings className="h-4 w-4" />
                              Configurer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Appareils en ligne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {devices.filter((d) => d.status === "online").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Appareils hors ligne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {devices.filter((d) => d.status === "offline").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des appareils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{devices.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

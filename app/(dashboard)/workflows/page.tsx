"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock, Thermometer, Users, Sun, ArrowRight } from "lucide-react";
import type { Workflow } from "@/types";

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Chauffage Matin",
    description: "Active le mode Confort à 7h00 en semaine.",
    trigger: "Heure : 07:00",
    action: "Mode Confort",
    status: "active",
  },
  {
    id: "2",
    name: "Absence Prolongée",
    description: "Passe en mode Eco après 1h sans movement.",
    trigger: "Pas de mouvement pendant 1h",
    action: "Mode Eco",
    status: "active",
  },
  {
    id: "3",
    name: "Lumières Salon Soir",
    description: "Allume les lumières du salon au coucher du soleil.",
    trigger: "Coucher du soleil",
    action: "Allumer lumières",
    status: "paused",
  },
];

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows] = useState<Workflow[]>(mockWorkflows);

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes("Heure")) return Clock;
    if (trigger.includes("mouvement")) return Users;
    if (trigger.includes("soleil")) return Sun;
    return Clock;
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Confort") || action.includes("Eco")) return Thermometer;
    if (action.includes("lumières")) return Sun;
    return Thermometer;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
          <p className="text-muted-foreground">
            Automatisez votre maison avec des workflows personnalisés
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="h-4 w-4" />
          Créer un workflow
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un workflow..."
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Workflow</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trigger</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkflows.map((workflow, index) => {
                  const TriggerIcon = getTriggerIcon(workflow.trigger);
                  const ActionIcon = getActionIcon(workflow.action);

                  return (
                    <tr
                      key={workflow.id}
                      className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${
                        index === filteredWorkflows.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <TriggerIcon className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-sm">{workflow.trigger}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <ActionIcon className="h-4 w-4 text-purple-500" />
                          </div>
                          <span className="text-sm">{workflow.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={workflow.status === "active" ? "default" : "secondary"}
                          className={
                            workflow.status === "active"
                              ? "border-green-500/50 bg-green-500/10 text-green-500"
                              : "border-gray-500/50 bg-gray-500/10 text-gray-500"
                          }
                        >
                          <div className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                          {workflow.status === "active" ? "Actif" : "En pause"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <Button size="sm" variant="outline">
                            Modifier
                          </Button>
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
              Workflows actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {workflows.filter((w) => w.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-500/20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/20 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workflows en pause
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {workflows.filter((w) => w.status === "paused").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{workflows.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

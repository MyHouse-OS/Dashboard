"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, Workflow, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/",
    icon: Home,
  },
  {
    title: "Appareils",
    url: "/appareils",
    icon: Grid3x3,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-primary-900 to-primary-800 text-white">
      <SidebarHeader className="border-b border-white/10 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-cyan-400 blur-md opacity-50" />
            <div className="relative rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 p-2">
              <Home className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">Smart Home</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-3 py-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`group relative overflow-hidden transition-all duration-200 ${
                        isActive
                          ? "bg-white/20 text-white shadow-lg shadow-cyan-500/20"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                        {isActive && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-blue-500 glow-cyan" />
                        )}
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white/70 hover:bg-white/10 hover:text-white">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white/70 hover:bg-white/10 hover:text-white">
              <Link href="/login" className="flex items-center gap-3 px-4 py-3">
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "../../context/BreadcrumbContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppVersion } from "./AppVersion";
import { AppSidebar } from "./Sidebar/AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);
  const context = {
    routes,
    setRoutes,
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbContext.Provider value={context}>
          <div
            className={cn(
              "flex min-h-screen max-h-screen overflow-hidden md:flex-cols-[220px_1fr] lg:flex-cols-[280px_1fr]"
            )}
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main
                className={cn(
                  "flex-1 flex flex-col overflow-hidden mt-5",
                  className
                )}
              >
                {children}
              </main>
            </div>
          </div>
          <AppVersion className="fixed bottom-0 right-0 z-50 p-2 text-xs" />
        </BreadcrumbContext.Provider>
      </SidebarInset>
    </SidebarProvider>
  );
};

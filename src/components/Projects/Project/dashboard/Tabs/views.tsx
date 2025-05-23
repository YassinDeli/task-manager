"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

interface ProjectViewTabsProps {
  children: React.ReactNode;
  defaultTab?: string;
}

export function ProjectViewTabs({
  children,
  defaultTab = "overview",
}: ProjectViewTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs
      defaultValue={defaultTab}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-none md:flex">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

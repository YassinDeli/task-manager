"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ContentSection from "@/components/Common/ContentSection";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { ProjectsOverview } from "./header/projects-overview"; // Adjust import path as needed
import { ProjectChart } from "./main/area-view";
import { Employees } from "./main/employees";
import { Projects } from "./main/projects";

export const GeneralDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const { setRoutes } = useBreadcrumb();

  // Remove unnecessary state (since we're using static data)
  useEffect(() => {
    setRoutes?.([
      { title: "Dashboard", href: "/dashboard" },
      { title: "Dashboard" }, // Current page
    ]);
  }, [setRoutes]);

  return (
    <div className="h-screen overflow-y-auto p-6">
      {/* Static ProjectsOverview (no props needed) */}
      <div className="mb-6">
        <ProjectsOverview />
      </div>
      <div className="mb-6">
        <ProjectChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Employees />
        <Projects />
      </div>
    </div>
  );
};

export default GeneralDashboard;

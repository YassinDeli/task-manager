import * as React from "react";
import {
  BookOpen,
  Briefcase,
  Cctv,
  ChartLine,
  ChartNoAxesColumnIncreasing,
  CheckCheck,
  CircleHelp,
  ClipboardCheck,
  Database,
  FileSearch,
  Flag,
  Frame,
  Info,
  Landmark,
  LayoutDashboard,
  Logs,
  LogsIcon,
  Map,
  OctagonX,
  PieChart,
  Settings2,
  Shield,
  Users,
  ClipboardList,
  TableProperties,
  SquareKanban,
  FolderKanban,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavProjects } from "./ProjectNav";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Task-manager",
      logo: ClipboardList,
    },
  ],
  navMain: [
    {
      id: 1,
      title: "Général",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/dashboard",
          icon: ChartLine,
        },
        {
          title: "Projects",
          url: "/projects/project", // absolute path → always goes to the right place
          icon: FolderKanban,
        },
      ],
    },
    {
      id: 2,
      title: "Tasks",
      url: "#",
      icon: ChartNoAxesColumnIncreasing,
      items: [
        {
          title: "Table-Task",
          url: "/tasks/task",
          icon: TableProperties,
        },
        {
          title: "Kanban",
          url: "/tasks/kanban",
          icon: SquareKanban,
        },
      ],
    },
    {
      id: 3,
      title: "Etat Des Actions",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Bilan des Actions",
          url: "#",
          icon: ClipboardCheck,
        },
        {
          title: "Toutes les Actions",
          url: "#",
          icon: Logs,
        },
      ],
    },
    {
      id: 4,
      title: "Applicabilté",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Applicables",
          url: "#",
          icon: ClipboardCheck,
        },
        {
          title: "A Vérifier",
          url: "#",
          icon: CircleHelp,
        },
        {
          title: "Pour Info",
          url: "#",
          icon: Info,
        },
      ],
    },
    {
      id: 5,
      title: "Management",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Entreprises",
          url: "/management/entreprises",
          icon: Landmark,
        },
        {
          title: "Content",
          url: "#",
          icon: Info,
        },
      ],
    },
    {
      id: 6,
      title: "Administrative Tools",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Logger",
          url: "#",
          icon: LogsIcon,
        },
        {
          title: "Users Management",
          url: "/users-management/users",
          icon: Users,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* @ts-ignore */}
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <MainNav items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

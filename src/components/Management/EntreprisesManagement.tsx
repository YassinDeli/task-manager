import { Building, Lock, PackageCheck, Users, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SidebarNav from "@/components/Common/SidebarNav";

interface EntreprisesManagementProps {
  className?: string;
  children?: React.ReactNode;
}

export default function EntreprisesManagement({
  className,
  children,
}: EntreprisesManagementProps) {
  //translations

  //menu items
  const sidebarNavItems = [
    {
      title: "Entreprises",
      icon: <Building size={18} />,
      href: "/management/entreprises",
    },
    {
      title: "Subscriptions",
      icon: <Wallet size={18} />,
      href: "/management/subscriptions",
    },
  ];

  return (
    <div className={cn("flex flex-col flex-1 mx-5 lg:mx-10", className)}>
      <div className="space-y-0.5 py-2 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Entreprise Management
        </h1>
        <p className="text-muted-foreground">
          Manage entreprises within the system
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex-1 flex flex-col overflow-hidden 2xl:flex-row gap-6">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-[7] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

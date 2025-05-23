import { Building, Lock, PackageCheck, Users, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProjectsManagementProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ProjectsManagement({
  className,
  children,
}: ProjectsManagementProps) {
  return (
    <div className={cn("flex flex-col flex-1 mx-5 lg:mx-10", className)} >
      <div className="flex-1 flex flex-col overflow-hidden 2xl:flex-row gap-6">
        <div className="flex flex-col flex-[7] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

import ContentSection from "@/components/Common/ContentSection";
import { DataTable } from "./data-table/data-table";
import { getProjectColumns } from "./data-table/columns";
import { useProjects } from "@/hooks/use-projects";

export default function ProjectsManagement() {
  const { data: projects, isPending } = useProjects();

  return (
    <>
      <ContentSection
        title="Project Management"
        desc="Manage projects within the system"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">
              View, manage, and customize projects
            </p>
          </div>
          <DataTable
            columns={getProjectColumns()}
            data={projects || []}
            isPending={isPending}
          />
        </div>
      </ContentSection>
    </>
  );
} 
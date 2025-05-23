import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";
import { ProjectActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getProjectColumns } from "./data-table/columns";
import { useProjectUpdateSheet } from "./modals/ProjectUpdateSheet";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useEmployeeStore } from "@/hooks/stores/useEmployeeStore";
import { projectSchema } from "@/types/validations/project.validation";
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { Project } from "@/types/project";
import { useProjectDeleteDialog } from "./modals/ProjectDeleteDialog"; // Import the delete dialog hook

export default function Projects() {
  const { setRoutes } = useBreadcrumb();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const employeeStore = useEmployeeStore();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Projects" },
      { title: "Projects", href: "/projects/projects" },
    ]);
  }, []);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: projectsResponse,
    isFetching: isProjectsPending,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: [
      "projects",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.project.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
      }),
  });

  const projects = React.useMemo(() => {
    if (!projectsResponse) return [];
    return projectsResponse.data;
  }, [projectsResponse]);

  const { mutate: updateProject, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id?: number; project: Partial<Project> }) =>
      api.project.update(data.id, data.project),
    onSuccess: (response: ServerResponse<Project>) => {
      toast.success(response.message);
      closeUpdateProjectSheet();
      refetchProjects();
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error(error.message);
    },
  });

  const { mutate: deleteProject, isPending: isDeletionPending } = useMutation({
    mutationFn: (id?: number) => api.project.remove(id),
    onSuccess: (response: ServerResponse<Project>) => {
      toast(response.message);
      refetchProjects();
    },
    onError: (error) => toast(error.message),
  });

  const handleUpdateProject = () => {
    const projectData = projectStore.getProject();

    const updatePayload = {
      name: projectData.name,
      description: projectData.description,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      status: projectData.status,
      priority: projectData.priority,
      responsibleId: projectData.responsible?.id || null,
      userId: projectData.userId,
    };

    const result = projectSchema.safeParse(updatePayload);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      projectStore.set("errors", result.error.flatten().fieldErrors);
      return;
    }

    if (!projectStore.id) {
      toast.error("Project ID is missing");
      return;
    }

    updateProject({
      id: projectStore.id,
      project: updatePayload,
    });
  };

  const {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  } = useProjectUpdateSheet({
    updateProject: handleUpdateProject,
    isUpdatePending,
    resetProject: () => {
      projectStore.reset();
      userStore.reset();
      employeeStore.reset();
    },
  });

  const {
    deleteProjectDialog,
    openDeleteProjectDialog,
    closeDeleteProjectDialog,
  } = useProjectDeleteDialog({
    projectLabel: projectStore.name,
    deleteProject: () => deleteProject(projectStore.id),
    isDeletionPending,
    resetProject: () => {
      projectStore.reset();
      closeDeleteProjectDialog();
    },
  });

  const context = {
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: projectsResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    openUpdateProjectSheet,
    openActivateProjectDialog: () => {}, // Implement as needed
    openDeactivateProjectDialog: () => {}, // Implement as needed
    openDeleteProjectDialog,
  };

  const isPending =
    isProjectsPending || paging || resizing || searching || sorting;

  return (
    <ProjectActionsContext.Provider value={context}>
      <ContentSection
        title="Projects"
        desc="View, manage, and customize projects"
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getProjectColumns()}
          data={projects}
          isPending={isPending}
        />
      </ContentSection>
      {updateProjectSheet}
      {deleteProjectDialog}
    </ProjectActionsContext.Provider>
  );
}

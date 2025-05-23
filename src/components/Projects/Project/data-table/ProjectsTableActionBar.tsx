"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Download } from "lucide-react";
import { Action, toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from "@/components/Projects/Project/data-table/data-table-action-bar";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import { exportTableToCSV } from "@/lib/projects/export";
import { useProjectDeleteDialog } from "@/components/Projects/Project/modals/ProjectDeleteDialog";

interface ProjectsTableActionBarProps {
  table: Table<any>;
}

export function ProjectsTableActionBar({ table }: ProjectsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const projectStore = useProjectStore();
  const queryClient = useQueryClient();
  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const { mutateAsync: deleteProject, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.project.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onProjectExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const { deleteProjectDialog, openDeleteProjectDialog, closeDeleteProjectDialog } =
  useProjectDeleteDialog({
    projectLabel: `${rows.length}  Projects`,
    deleteProject: async () => {
      const ids = rows.map((row) => row.original.id);
      await Promise.all(ids.map((id) => deleteProject(id)));
      ids.forEach((id) => api.project.remove(id));
      table.toggleAllRowsSelected(false);
      projectStore.reset();
      toast(
        `${ids.length} project${ids.length > 1 ? "s" : ""} deleted successfully`
      );
    },
    isDeletionPending,
    resetProject: () => projectStore.reset(),
  });

const onProjectDelete = React.useCallback(() => {
  openDeleteProjectDialog();
}, [openDeleteProjectDialog]);


  return (
    <TooltipProvider>
      <DataTableActionBar table={table} visible={rows.length > 0}>
        <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
          <span className="whitespace-nowrap text-xs">
            {rows.length} selected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DataTableActionBarAction
            size="icon"
            tooltip="Delete projects"
            isPending={isPending || isDeletionPending}
            onClick={onProjectDelete}
          >
            <Trash2 />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Export projects"
            isPending={getIsActionPending("export")}
            onClick={(e) => {
              e.preventDefault();
              onProjectExport();
            }}
          >
            <Download />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
      {deleteProjectDialog}
    </TooltipProvider>
  );
}

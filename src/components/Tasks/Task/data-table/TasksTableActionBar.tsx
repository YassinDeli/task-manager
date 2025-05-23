"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Download } from "lucide-react";
import { Action, toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from "@/components/Tasks/Task/data-table/data-table-action-bar";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import { exportTableToCSV } from "@/lib/tasks/export";
import { useTaskDeleteDialog } from "@/components/Tasks/Task/modals/TaskDeleteDialog";

interface TasksTableActionBarProps {
  table: Table<any>;
}

export function TasksTableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const taskStore = useTaskStore();
  const queryClient = useQueryClient();
  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const { mutateAsync: deleteTask, isPending: isDeletionPending } = useMutation(
    {
      mutationFn: (id: number) => api.task.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const onTaskExport = React.useCallback(() => {
    setCurrentAction({
      label: "Export",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
    });
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const { deleteTaskDialog, openDeleteTaskDialog, closeDeleteTaskDialog } =
    useTaskDeleteDialog({
      taskLabel: `${rows.length}  Tasks`,
      deleteTask: async () => {
        const ids = rows.map((row) => row.original.id);
        await Promise.all(ids.map((id) => deleteTask(id)));
        ids.forEach((id) => api.task.remove(id));
        table.toggleAllRowsSelected(false);
        taskStore.reset();
        toast(
          `${ids.length} task${ids.length > 1 ? "s" : ""} deleted successfully`
        );
      },
      isDeletionPending,
      resetTask: () => taskStore.reset(),
    });

  const onTaskDelete = React.useCallback(() => {
    openDeleteTaskDialog();
  }, [openDeleteTaskDialog]);

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
            tooltip="Delete tasks"
            isPending={isPending || isDeletionPending}
            onClick={onTaskDelete}
          >
            <Trash2 />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Export tasks"
            isPending={getIsActionPending({
              label: "Export",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
            })}
            onClick={(e) => {
              e.preventDefault();
              onTaskExport();
            }}
          >
            <Download />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
      {deleteTaskDialog}
    </TooltipProvider>
  );
}

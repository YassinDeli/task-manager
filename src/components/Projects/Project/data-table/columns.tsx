// In your columns definition file

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Project } from "@/types/project";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CircleDot, // for NOT_STARTED
  Calendar, // for PLANNED
  Loader2, // for IN_PROGRESS
  CheckCircle2, // for COMPLETED
  PauseCircle, // for ON_HOLD
  XCircle, // for CANCELLED
  ArrowDown, // for LOW
  Minus, // for MEDIUM
  ArrowUp, // for HIGH
} from "lucide-react";

export const getProjectColumns = (): ColumnDef<Project>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-10 flex justify-center">
          <Checkbox
            className="w-4 h-4"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-10 flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" attribute="name" />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Description"
          attribute="description"
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">{row.original.description}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          attribute="status"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.status === "COMPLETED" ? (
            <CheckCircle2 className="text-green-500 dark:text-green-400" />
          ) : row.original.status === "NOT_STARTED" ? (
            <CircleDot className="text-gray-500 dark:text-gray-400" />
          ) : row.original.status === "PLANNED" ? (
            <Calendar className="text-blue-500 dark:text-blue-400" />
          ) : row.original.status === "IN_PROGRESS" ? (
            <Loader2 className="text-orange-500 dark:text-orange-400" />
          ) : row.original.status === "ON_HOLD" ? (
            <PauseCircle className="text-yellow-500 dark:text-yellow-400" />
          ) : row.original.status === "CANCELLED" ? (
            <XCircle className="text-red-500 dark:text-red-400" />
          ) : null}
          {row.original.status}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Priority"
          attribute="priority"
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.priority === "LOW" ? (
            <ArrowDown className="text-blue-500 dark:text-blue-400" />
          ) : row.original.priority === "MEDIUM" ? (
            <Minus className="text-yellow-500 dark:text-yellow-400" />
          ) : row.original.priority === "HIGH" ? (
            <ArrowUp className="text-red-500 dark:text-red-400" />
          ) : null}
          {row.original.priority}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "responsible",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Responsible"
          attribute="responsible.user.firstName" // Can sort by firstName
        />
      ),
      cell: ({ row }) => {
        const responsible = row.original.responsible;

        if (!responsible) {
          return <span className="text-muted-foreground">Unassigned</span>;
        }

        const user = responsible.user;
        const displayName =
          [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
          user?.username;

        return (
          <div className="flex items-center gap-2">
            {user?.image && (
              <img
                src={user.image}
                alt="User"
                className="h-6 w-6 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{displayName}</div>
              {user?.email && (
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        // Custom sorting by name
        const nameA = [
          rowA.original.responsible?.user?.firstName,
          rowA.original.responsible?.user?.lastName,
        ]
          .filter(Boolean)
          .join(" ");
        const nameB = [
          rowB.original.responsible?.user?.firstName,
          rowB.original.responsible?.user?.lastName,
        ]
          .filter(Boolean)
          .join(" ");
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "Project",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Project-Manager"
          attribute="user.username"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.user?.username || (
            <span className="opacity-70">No Employee Assigned Yet</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Start Date"
          attribute="startDate"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.startDate ? (
            format(new Date(row.original.startDate), "yyyy-MM-dd")
          ) : (
            <span className="opacity-70">No Start Date</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="End Date"
          attribute="endDate"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.endDate ? (
            format(new Date(row.original.endDate), "yyyy-MM-dd")
          ) : (
            <span className="opacity-70">No End Date</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          attribute="createdAt"
        />
      ),
      cell: ({ row }) => (
        <div>
          {format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm:ss")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} />
        </div>
      ),
    },
  ];
};

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CircleDot, // for TODO
  Loader2, // for IN_PROGRESS
  CheckCircle2, // for DONE
  ArrowDown, // LOW
  Minus, // MEDIUM
  ArrowUp,
  CheckCircle2Icon,
  LoaderIcon,
  ClipboardListIcon,
  ArrowDownIcon,
  MinusIcon,
  ArrowUpIcon, // HIGH
} from "lucide-react";

export const getTaskColumns = (): ColumnDef<Task>[] => {
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Title"
          attribute="title"
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.title}</div>,
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
          {row.original.status === "DONE" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : row.original.status === "TODO" ? (
            <ClipboardListIcon className="text-blue-500 dark:text-blue-400" />
          ) : (
            <LoaderIcon />
          )}
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
            <ArrowDownIcon className="text-blue-500 dark:text-blue-400" />
          ) : row.original.priority === "MEDIUM" ? (
            <MinusIcon className="text-yellow-500 dark:text-yellow-400" />
          ) : row.original.priority === "HIGH" ? (
            <ArrowUpIcon className="text-red-500 dark:text-red-400" />
          ) : null}
          {row.original.priority}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },

    {
      accessorKey: "Employee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Employee"
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
      accessorKey: "project",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Project"
          attribute="project.name"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.project?.name || (
            <span className="opacity-70">No Project Assigned Yet</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },

    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Due Date"
          attribute="dueDate"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.dueDate ? (
            format(new Date(row.original.dueDate), "yyyy-MM-dd")
          ) : (
            <span className="opacity-70">No Due Date</span>
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

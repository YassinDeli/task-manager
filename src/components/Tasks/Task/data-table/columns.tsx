import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Task } from "@/types/task";
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
import { TaskPriority, TaskStatus } from "@/types/task";

const priorityColors = {
  [TaskPriority.LOW]: "bg-green-600",
  [TaskPriority.MEDIUM]: "bg-yellow-600",
  [TaskPriority.HIGH]: "bg-red-600",
};

const statusColors = {
  [TaskStatus.TODO]: "bg-gray-600",
  [TaskStatus.IN_PROGRESS]: "bg-blue-600",
  [TaskStatus.DONE]: "bg-green-600",
  [TaskStatus.BLOCKED]: "bg-red-600",
};

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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" attribute="id" />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-[10px] sm:text-xs break-all max-w-[120px]">
          {row.original.id}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
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
      cell: ({ row }) => (
        <div className="font-medium text-xs break-words max-w-[150px]">
          {row.original.title}
        </div>
      ),
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
        <div className="text-xs break-words max-w-[200px]">
          {row.original.description || (
            <span className="text-muted-foreground">No Description</span>
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
        <div className="text-xs break-words max-w-[100px]">
          {row.original.project?.name || (
            <span className="text-muted-foreground">No Project</span>
          )}
        </div>
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
          className={cn(
            "text-[10px] font-medium text-white whitespace-nowrap px-1.5 py-0.5",
            statusColors[row.original.status]
          )}
        >
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
          className={cn(
            "text-[10px] font-medium text-white whitespace-nowrap px-1.5 py-0.5",
            priorityColors[row.original.priority]
          )}
        >
          {row.original.priority}
        </Badge>
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
        <div className="text-xs whitespace-nowrap">
          {row.original.dueDate ? (
            format(row.original.dueDate, "yyyy-MM-dd")
          ) : (
            <span className="text-muted-foreground">No Due Date</span>
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

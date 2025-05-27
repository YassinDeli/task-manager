// In your columns definition file

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Project } from "@/types/project";
import { Checkbox } from "@/components/ui/checkbox";

export const getProjectColumns = (): ColumnDef<Project>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-8">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-8">
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
        <div className="font-medium">
          {row.original.id}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" attribute="name" />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {row.original.name}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" attribute="description" />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.description || <span className="opacity-70">No Description</span>}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" attribute="status" />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.status}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" attribute="startDate" />
      ),
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap">
          {row.original.startDate ? format(row.original.startDate, "yyyy-MM-dd") : "Not set"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" attribute="endDate" />
      ),
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap">
          {row.original.endDate ? format(row.original.endDate, "yyyy-MM-dd") : "Not set"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" attribute="createdAt" />
      ),
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap">
          {format(new Date(row.original.createdAt), "yyyy-MM-dd")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
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
      enableHiding: false,
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

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { User } from "@/types/user-management";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

export const getUserColumns = (): ColumnDef<User>[] => {
  return [
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
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Username"
          attribute="username"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-xs break-words max-w-[100px]">
          {row.original.username}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="E-Mail"
          attribute="email"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-xs break-words max-w-[150px]">
          {row.original.email}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Firstname"
          attribute="firstName"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs break-words max-w-[100px]">
          {row.original.firstName || (
            <span className="text-muted-foreground">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Lastname"
          attribute="lastName"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs break-words max-w-[100px]">
          {row.original.lastName || (
            <span className="text-muted-foreground">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Birth"
          attribute="dateOfBirth"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap">
          {(row.original.dateOfBirth &&
            format(row.original.dateOfBirth, "yyyy-MM-dd")) || (
            <span className="text-muted-foreground">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "roleId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          attribute="role.label"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs break-words max-w-[100px]">
          {row.original?.role?.label || (
            <span className="text-muted-foreground">No Role</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Active"
          attribute="isActive"
        />
      ),
      cell: ({ row }) => (
        <Badge
          className={cn(
            "text-[10px] font-medium text-white whitespace-nowrap px-1.5 py-0.5",
            row.original.isActive ? "bg-green-600" : "bg-red-600"
          )}
        >
          {row.original.isActive ? "Yes" : "No"}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} />
        </div>
      ),
    },
  ];
};

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Role } from "@/types/user-management";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const getRoleColumns = (): ColumnDef<Role>[] => {
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
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Label"
          attribute="label"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-xs break-words max-w-[100px]">
          {row.original.label}
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
      accessorKey: "permissions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Permissions"
          attribute="permissions"
        />
      ),
      cell: ({ row }) => {
        // Ensure `entries` is always an array to prevent undefined errors
        const entries = row.original.permissions ?? [];

        if (entries.length === 0) {
          return <div className="opacity-70">No Permissions</div>;
        }

        const visiblePermissions = entries.slice(0, 2); // Show first 2 permissions
        const hiddenPermissions = entries.length - visiblePermissions.length;
        return (
          <div>
            <div className="line-clamp-1">
              {visiblePermissions.map((entry, index) => (
                <span key={index} className="mr-1">
                  {entry?.permission?.label?.toUpperCase() || "Unknown"}
                  {index < visiblePermissions.length - 1 && ", "}
                </span>
              ))}
              {hiddenPermissions > 0 && (
                <span className="opacity-50 mx-2">{`+${hiddenPermissions} more`}</span>
              )}
            </div>
          </div>
        );
      },
      enableSorting: false,
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
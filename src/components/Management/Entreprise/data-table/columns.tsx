import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import { Entreprise } from "@/types";

export const getEntrepriseColumns = (): ColumnDef<Entreprise>[] => {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" attribute="name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-xs break-words max-w-[150px]">
          {row.original.name}
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
        <div className="text-xs break-words max-w-[200px]">
          {row.original.email}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone"
          attribute="phone"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs whitespace-nowrap">
          {row.original.phone || <span className="text-muted-foreground">No Phone</span>}
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
        <div className="text-xs whitespace-nowrap">
          {format(new Date(row.original.createdAt), "yyyy-MM-dd")}
        </div>
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

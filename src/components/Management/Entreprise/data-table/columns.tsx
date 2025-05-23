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
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
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
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="E-Mail"
          attribute="email"
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
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
        <div>
          {row.original.phone || <span className="opacity-70">No Phone</span>}
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
        <div>{new Date(row.original.createdAt).toISOString()}</div>
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

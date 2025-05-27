import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Permission } from '@/types/user-management';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";

export const getPermissionColumns = (): ColumnDef<Permission>[] => {
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
            accessorKey: 'id',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="ID"
                    attribute="id"
                />
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
            accessorKey: 'label',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Name"
                    attribute="label"
                />
            ),
            cell: ({ row }) => (
                <div className="font-bold">
                    {row.original.label}
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorKey: 'description',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Description"
                    attribute="description"
                />
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
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <DataTableRowActions row={row} />
                </div>
            ),
        },
    ];
};
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Permission } from '@/types/user-management';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import ContentSection from "@/components/Common/ContentSection";

export const getPermissionColumns = (): ColumnDef<Permission>[] => {
    return [
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
                <div className="font-mono text-[10px] sm:text-xs break-all max-w-[120px]">
                    {row.original.id}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: 'label',
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
            accessorKey: 'description',
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
            accessorKey: 'module',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Module"
                    attribute="module"
                />
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="text-[10px] font-medium whitespace-nowrap">
                    {row.original.module}
                </Badge>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <DataTableRowActions row={row} />
                </div>
            ),
        },
    ];
};
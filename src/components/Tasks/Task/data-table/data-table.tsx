import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageOpen } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { Spinner } from "@/components/Common/Spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TasksTableActionBar } from "./TasksTableActionBar"; 


interface DataTableProps<TData, TValue> {
  className?: string;
  containerClassName?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending: boolean;
  
}

export function DataTable<TData, TValue>({
  className,
  containerClassName,
  columns,
  data,
  isPending,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    description: !isMobile,
    project: !isMobile,
    dueDate: !isMobile,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    setColumnVisibility(prev => ({
      ...prev,
      description: !isMobile,
      project: !isMobile,
      dueDate: !isMobile,
    }));
  }, [isMobile]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <DataTableToolbar table={table} />
      <div className={cn("rounded-md border bg-background overflow-hidden", containerClassName)}>
        <div className="w-full overflow-x-auto overflow-y-hidden touch-pan-x">
          <Table>
            <TableHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id} 
                        colSpan={header.colSpan}
                        className="px-2 py-2 h-10 text-xs font-medium text-muted-foreground"
                        style={{ 
                          minWidth: header.column.id === 'id' ? '120px' : 
                                  header.column.id === 'actions' ? '50px' : '100px',
                          maxWidth: header.column.id === 'actions' ? '50px' : undefined
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length && !isPending ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="px-2 py-2 text-xs"
                        style={{ 
                          minWidth: cell.column.id === 'id' ? '120px' : 
                                  cell.column.id === 'actions' ? '50px' : '100px',
                          maxWidth: cell.column.id === 'actions' ? '50px' : undefined
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !isPending ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      No Results <PackageOpen className="h-3 w-3" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs">
                      Loading Data, Please Wait... <Spinner className="h-3 w-3" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
      <TasksTableActionBar table={table} /> 
    </div>
  );
}
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";
import { useProjectActions } from "./action-context";
import { PackagePlus } from "lucide-react";
import { useRouter } from "next/router";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const { setPage, searchTerm, setSearchTerm } = useProjectActions();
  
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter Projects..."
          value={searchTerm.toString()}
          onChange={(event) => {
            setPage(1);
            setSearchTerm(event.target.value);
          }}
          className="h-8 w-full sm:w-[300px]"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="h-8 w-full sm:w-auto"
          variant="outline"
          onClick={() => router.push("/projects/new-project")}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

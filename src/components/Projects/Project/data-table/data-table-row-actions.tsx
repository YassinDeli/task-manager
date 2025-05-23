import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Settings2, Telescope, Trash } from "lucide-react";
import { useProjectActions } from "./action-context";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { Project } from "@/types/project";
import { useRouter } from "next/router";

interface DataTableRowActionsProps {
  row: Row<Project>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const project = row.original;
  const router = useRouter();
  const { openUpdateProjectSheet, openDeleteProjectDialog } =
    useProjectActions();
  const { setProject } = useProjectStore();

  const handleInspect = async () => {
    // Set project data in store before navigation
    setProject(project);
    // Navigate without forcing refresh
    await router.push(`/projects/${project.id}/dashboard`);
  };

  const handleUpdate = () => {
    setProject(project);
    openUpdateProjectSheet();
  };

  const handleDelete = () => {
    setProject(project);
    openDeleteProjectDialog();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleInspect}>
          <Telescope className="h-5 w-5 mr-2" /> Inspect
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUpdate}>
          <Settings2 className="h-5 w-5 mr-2" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem className="bg-red-700" onClick={handleDelete}>
          <Trash className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

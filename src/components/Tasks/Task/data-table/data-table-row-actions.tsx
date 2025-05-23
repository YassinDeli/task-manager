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
import {
  Settings2,
  ShieldCheck,
  ShieldMinus,
  Telescope,
  Trash,
  CopyIcon,
  Trash2,
} from "lucide-react";
import { useTaskActions } from "./action-context";
import { useTaskStore } from "@/hooks/stores/useTaskStore";
import { Task } from "@/types";

interface DataTableRowActionsProps {
  row: Row<Task>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const user = row.original;
  const {
    openUpdateTaskSheet,
    openDeleteTaskDialog,
    openDuplicateTaskDialog,
  } = useTaskActions();

  const userStore = useTaskStore();

  const targetTask = () => {
    userStore.setTask(user);
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
        <DropdownMenuLabel className="text-center">Actions </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <Telescope className="h-5 w-5 mr-2" /> Inspect
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            targetTask();
            openUpdateTaskSheet();
          }}
        >
          <Settings2 className="h-5 w-5 mr-2" /> Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-700"
          onClick={() => {
            targetTask();
            openDeleteTaskDialog();
          }}
        >
          <Trash className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            targetTask();
            openDuplicateTaskDialog();
          }}
        >
          <CopyIcon className="h-5 w-5 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

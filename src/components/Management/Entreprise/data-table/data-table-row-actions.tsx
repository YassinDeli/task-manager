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
} from "lucide-react";
import { useEntrepriseActions } from "./action-context";
import { useEntrepriseStore } from "@/hooks/stores/useEntrepriseStore";
import { Entreprise } from "@/types";

interface DataTableRowActionsProps {
  row: Row<Entreprise>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const user = row.original;
  const {
    openUpdateEntrepriseSheet,
    openActivateEntrepriseDialog,
    openDeleteEntrepriseDialog,
    openDeactivateEntrepriseDialog,
  } = useEntrepriseActions();

  const userStore = useEntrepriseStore();

  const targetEntreprise = () => {
    userStore.setEntreprise(user);
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
            targetEntreprise();
            openUpdateEntrepriseSheet();
          }}
        >
          <Settings2 className="h-5 w-5 mr-2" /> Update
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* {user.isActive ? (
          <DropdownMenuItem
            onClick={() => {
              targetEntreprise();
              openDeactivateEntrepriseDialog();
            }}
          >
            <ShieldMinus className="h-5 w-5 mr-2" /> Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              targetEntreprise();
              openActivateEntrepriseDialog();
            }}
          >
            <ShieldCheck className="h-5 w-5 mr-2" /> Activate
          </DropdownMenuItem>
        )} */}
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-700"
          onClick={() => {
            targetEntreprise();
            openDeleteEntrepriseDialog();
          }}
        >
          <Trash className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem>*/}
        {/*<DropdownMenuItem
          onClick={() => {
            targetRole();
            openDuplicateRoleDialog();
          }}
        >
          <CopyIcon className="h-5 w-5 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            targetRole();
            openDeleteRoleDialog();
          }}
        >
          <Trash2 className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

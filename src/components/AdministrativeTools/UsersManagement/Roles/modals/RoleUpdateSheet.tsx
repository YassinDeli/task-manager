import { BookUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleForm } from "../RoleForm";
import { usePermissions } from "@/hooks/content/usePermissions";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { Permission } from "@/types/user-management";

interface RoleUpdateSheet {
  updateRole?: () => void;
  isUpdatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleUpdateSheet = ({
  updateRole,
  isUpdatePending,
  resetRole,
}: RoleUpdateSheet) => {
  const { permissions, isFetchPermissionsPending } = usePermissions();
  const roleStore = useRoleStore();

  // Map RolePermission to Permission with all required properties
  const selectedPermissions: Permission[] =
    roleStore.permissions?.map((rp) => {
      const permission = permissions.find((p) => p.id === rp.permissionId);
      return {
        id: rp.permissionId,
        label: permission?.label || "",
        description: permission?.description || "",
        createdAt: permission?.createdAt || new Date(),
        updatedAt: permission?.updatedAt || new Date(),
        deletedAt: permission?.deletedAt || null,
        isDeletionRestricted: permission?.isDeletionRestricted || false,
      };
    }) || [];

  const {
    SheetFragment: updateRoleSheet,
    openSheet: openUpdateRoleSheet,
    closeSheet: closeUpdateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        Update Role
      </div>
    ),
    description:
      "Use this form to update role within the system. A role determines the access level and permissions granted to users assigned to it.",
    children: (
      <div>
        <RoleForm
          className="my-4"
          permissions={permissions}
          selectedPermissions={selectedPermissions} // Pass the mapped permissions
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              updateRole?.();
            }}
          >
            Update
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeUpdateRoleSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetRole,
  });

  return {
    updateRoleSheet,
    openUpdateRoleSheet,
    closeUpdateRoleSheet,
  };
};

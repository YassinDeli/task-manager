import { api } from "@/api";
import ContentSection from "@/components/Common/ContentSection";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";
import { EntrepriseActionsContext } from "./data-table/action-context";
import { DataTable } from "./data-table/data-table";
import { getEntrepriseColumns } from "./data-table/columns";
import { useEntrepriseUpdateSheet } from "./modals/EntrepriseUpdateSheet"; // Import the new hook
import { useEntrepriseStore } from "@/hooks/stores/useEntrepriseStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useEmployeeStore } from "@/hooks/stores/useEmployeeStore";
import { entrepriseSchema } from "@/types/validations/entreprise.validation"; // Import the Zod schema
import { toast } from "sonner";
import { ServerResponse } from "@/types";
import { Entreprise, UpdateEnterpriseDto } from "@/types/entreprise"; // Adjust the path as needed
import { useEntrepriseDeleteDialog } from "./modals/EntrepriseDeleteDialog"; // Import the delete dialog hook

export default function Entreprises() {
  const { setRoutes } = useBreadcrumb();
  const entrepriseStore = useEntrepriseStore();
  const userStore = useUserStore();
  const employeeStore = useEmployeeStore();

  React.useEffect(() => {
    setRoutes?.([
      { title: "Management" },
      { title: "Entreprises", href: "/management/entreprises" },
    ]);
  }, []);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true,
    sortKey: "id",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  const {
    data: entreprisesResponse,
    isFetching: isEntreprisesPending,
    refetch: refetchEntreprises,
  } = useQuery({
    queryKey: [
      "entreprises",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.entreprise.findPaginated({
        page: debouncedPage.toString(),
        size: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey}:${
          debouncedSortDetails.order ? "ASC" : "DESC"
        }`,
        search: debouncedSearchTerm,
        join: "address", // Ensure address data is included
      }),
  });

  const entreprises = React.useMemo(() => {
    if (!entreprisesResponse) return [];
    return entreprisesResponse.data;
  }, [entreprisesResponse]);

  const { mutate: updateEntreprise, isPending: isUpdatePending } = useMutation({
    mutationFn: async (data: { id?: number; entreprise: UpdateEnterpriseDto }) => {
      if (data.id === undefined) {
        throw new Error("Entreprise ID is missing");
      }
      const response = await api.entreprise.update(data.id, data.entreprise);
      return {
        message: "Entreprise updated successfully",
        code: 200,
        data: response,
      };
    },
    onSuccess: (response: ServerResponse<Entreprise>) => {
      toast.success(response.message);
      closeUpdateEntrepriseSheet();
      refetchEntreprises();
    },
    onError: (error) => {
      console.error('Error updating entreprise:', error);
      toast.error(error.message);
    },
  });

  const { mutate: deleteEntreprise, isPending: isDeletionPending } = useMutation({
    mutationFn: async (id: number) => {
      return api.entreprise.remove(id);
    },
    onSuccess: (response: ServerResponse<Entreprise>) => {
      toast(response.message);
      refetchEntreprises();
    },
    onError: (error) => toast(error.message),
  });

  const handleUpdateEntreprise = () => {
    const entrepriseData = entrepriseStore.getEntreprise();

    const updatePayload = {
      name: entrepriseData.name || "",
      phone: entrepriseData.phone || "",
      email: entrepriseData.email || "",
      responsibleId: entrepriseData.responsibleId ?? 0, // Ensure a default value
      address: entrepriseStore.getEntrepriseAddress() || {} // Ensure a default value
    };

    const result = entrepriseSchema.safeParse(updatePayload);

    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      entrepriseStore.set("errors", result.error.flatten().fieldErrors);
      return;
    }

    if (!entrepriseStore.id) {
      toast.error("Entreprise ID is missing");
      return;
    }

    updateEntreprise({
      id: entrepriseStore.id,
      entreprise: updatePayload as UpdateEnterpriseDto,
    });
  };

  const {
    updateEntrepriseSheet,
    openUpdateEntrepriseSheet,
    closeUpdateEntrepriseSheet,
  } = useEntrepriseUpdateSheet({
    updateEntreprise: handleUpdateEntreprise,
    isUpdatePending,
    resetEntreprise: () => {
      entrepriseStore.reset();
      userStore.reset();
      employeeStore.reset();
    },
  });

  const {
    deleteEntrepriseDialog,
    openDeleteEntrepriseDialog,
    closeDeleteEntrepriseDialog,
  } = useEntrepriseDeleteDialog({
    entrepriseLabel: entrepriseStore.name,
    deleteEntreprise: () => deleteEntreprise(entrepriseStore.id || 0),
    isDeletionPending,
    resetEntreprise: () => {
      entrepriseStore.reset();
      closeDeleteEntrepriseDialog();
    },
  });

  const context = {
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: entreprisesResponse?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    openUpdateEntrepriseSheet,
    openActivateEntrepriseDialog: () => {}, // Implement as needed
    openDeactivateEntrepriseDialog: () => {}, // Implement as needed
    openDeleteEntrepriseDialog,
  };

  const isPending =
    isEntreprisesPending || paging || resizing || searching || sorting;

  return (
    <EntrepriseActionsContext.Provider value={context}>
      <ContentSection
        title="Entreprises"
        desc="View, manage, and customize entreprises"
        className="w-full"
      >
        <DataTable
          className="flex flex-col flex-1 overflow-hidden p-1"
          containerClassName="overflow-auto"
          columns={getEntrepriseColumns()}
          data={entreprises}
          isPending={isPending}
        />
      </ContentSection>
      {updateEntrepriseSheet}
      {deleteEntrepriseDialog}
    </EntrepriseActionsContext.Provider>
  );
}

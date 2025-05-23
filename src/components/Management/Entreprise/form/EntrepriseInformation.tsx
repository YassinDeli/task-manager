import { FormBuilder } from "@/components/Common/FormBuilder/FormBuilder";
import { useCountries } from "@/hooks/content/useCountries";
import { useEntrepriseStore } from "@/hooks/stores/useEntrepriseStore";
import { cn } from "@/lib/utils";
import { DynamicForm } from "@/types";
import { Country } from "@prisma/client";
import { useTranslation } from "react-i18next";

interface EntrepriseInformationProps {
  className?: string;
}
export const EntrepriseInformation = ({
  className,
}: EntrepriseInformationProps) => {
  const { t: tCountries } = useTranslation("countries");
  const entrepriseStore = useEntrepriseStore();
  const { countries, isFetchCountriesPending } = useCountries();
  const form: DynamicForm = {
    name: "Entreprise Information",
    description: "This is a dynamic form",
    grids: [
      {
        name: "General Information",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Entreprise Name",
                variant: "text",
                required: true,
                placeholder: "Enter the company name",
                description:
                  "The official name of the entreprise. This will be used for all business communications.",
                error: entrepriseStore.errors?.name?.[0],
                props: {
                  value: entrepriseStore.name,
                  onChange: (value) => {
                    entrepriseStore.set("name", value);
                    entrepriseStore.resetError("name");
                  },
                },
              },
            ],
          },
          {
            id: 2,
            fields: [
              {
                label: "E-mail",
                variant: "email",
                required: true,
                placeholder: "contact@domain.xyz",
                description:
                  "Provide a valid email address for official correspondence.",
                error: entrepriseStore.errors?.email?.[0],
                props: {
                  value: entrepriseStore.email,
                  onChange: (value) => {
                    entrepriseStore.set("email", value);
                    entrepriseStore.resetError("email");
                  },
                },
              },
              {
                label: "Phone",
                variant: "tel",
                required: true,
                placeholder: "123-456-7890",
                description: "The primary contact number for the entreprise.",
                error: entrepriseStore.errors?.phone?.[0],
                props: {
                  value: entrepriseStore.phone,
                  onChange: (value) => {
                    entrepriseStore.set("phone", value);
                    entrepriseStore.resetError("phone");
                  },
                },
              },
            ],
          },
        ],
      },
      {
        name: "Address Information",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Address",
                variant: "text",
                required: true,
                placeholder: "123 Street Name",
                description:
                  "The street address where the entreprise is located.",
                error: entrepriseStore.addressErrors?.address?.[0],
                props: {
                  value: entrepriseStore.address?.address || undefined,
                  onChange: (value) => {
                    entrepriseStore.setInAddress("address", value);
                    entrepriseStore.resetAddressError("address");
                  },
                },
              },
              {
                label: "Complementary Address",
                variant: "text",
                required: false,
                placeholder: "Suite 101 Building A",
                description:
                  "Additional address details such as apartment, suite, or floor.",
                error: entrepriseStore.addressErrors?.address2?.[0],
                props: {
                  value: entrepriseStore.address?.address2 || undefined,
                  onChange: (value) => {
                    entrepriseStore.setInAddress("address2", value);
                    entrepriseStore.resetAddressError("address2");
                  },
                },
              },
              {
                label: "Zip Code",
                variant: "number",
                required: true,
                placeholder: "12345",
                description: "The postal code for the entreprise's location.",
                error: entrepriseStore.addressErrors?.zipcode?.[0],
                props: {
                  value: entrepriseStore.address?.zipcode || undefined,
                  onChange: (value) => {
                    entrepriseStore.setInAddress("zipcode", value);
                    entrepriseStore.resetAddressError("zipcode");
                  },
                },
              },
            ],
          },
          {
            id: 2,
            fields: [
              {
                label: "Region",
                variant: "text",
                required: true,
                placeholder: "State/Province",
                description:
                  "The region, state, or province where the entreprise is located.",
                error: entrepriseStore.addressErrors?.region?.[0],
                props: {
                  value: entrepriseStore.address?.region || undefined,
                  onChange: (value) => {
                    entrepriseStore.setInAddress("region", value);
                    entrepriseStore.resetAddressError("region");
                  },
                },
              },
              {
                label: "Country",
                variant: "select",
                required: true,
                placeholder: "Select a Country",
                description:
                  "Select the country where the entreprise is registered.",
                error: entrepriseStore.addressErrors?.countryId?.[0],
                props: {
                  selectOptions: countries.map((country: Country) => {
                    return {
                      label: country.alpha2code
                        ? tCountries(country?.alpha2code)
                        : "",
                      value: country.id.toString(),
                    };
                  }),
                  value: entrepriseStore?.address?.countryId
                    ? entrepriseStore?.address?.countryId.toString()
                    : "",
                  onValueChange: (value: string) => {
                    entrepriseStore.setInAddress("countryId", parseInt(value));
                    entrepriseStore.resetAddressError("countryId");
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
  return (
    <div
      className={cn(
        "flex flex-col pb-20 overflow-hidden container mx-auto",
        className
      )}
    >
      <FormBuilder className="mx-auto mt-5" form={form} />
    </div>
  );
};

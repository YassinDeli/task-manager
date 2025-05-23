import React from "react";
import { FormBuilder } from "@/components/Common/FormBuilder/FormBuilder";
import { useEmployeeStore } from "@/hooks/stores/useEmployeeStore";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { cn } from "@/lib/utils";
import { DynamicForm } from "@/types";

interface ResponsibleInformationProps {
  className?: string;
}
export const ResponsibleInformation = ({
  className,
}: ResponsibleInformationProps) => {
  const employeeStore = useEmployeeStore();
  const userStore = useUserStore();

  const form: DynamicForm = {
    name: "Responsible Information",
    grids: [
      {
        name: "General Information",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "First Name",
                variant: "text",
                required: true,
                placeholder: "Enter the first name of the responsible",
                description: "The first name of the responsible.",
                error: userStore.errors?.firstName?.[0],
                props: {
                  value: userStore.firstName || undefined,
                  onChange: (value) => {
                    userStore.set("firstName", value);
                    userStore.resetError("firstName");
                  },
                },
              },
              {
                label: "Last Name",
                variant: "text",
                required: true,
                placeholder: "Enter the last name of the responsible",
                description: "The last name of the responsible.",
                error: userStore.errors?.lastName?.[0],
                props: {
                  value: userStore.lastName || undefined,
                  onChange: (value) => {
                    userStore.set("lastName", value);
                    userStore.resetError("lastName");
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
                error: userStore.errors?.email?.[0],
                props: {
                  value: userStore.email || undefined,
                  onChange: (value) => {
                    userStore.set("email", value);
                    userStore.resetError("email");
                  },
                },
              },
              {
                label: "Phone",
                variant: "tel",
                required: false,
                placeholder: "123-456-7890",
                description: "The primary contact number for the responsible.",
                error: userStore.errors?.phone?.[0],
                props: {
                  value: employeeStore.phone || undefined,
                  onChange: (value) => {
                    employeeStore.set("phone", value);
                    employeeStore.resetError("phone");
                  },
                },
              },
            ],
          },
          {
            id: 3,
            fields: [
              {
                label: "Date of Birth",
                variant: "date",
                required: false,
                description: "The date of birth of the responsible",
                error: userStore.errors?.dateOfBirth?.[0],
                props: {
                  value: userStore.dateOfBirth || undefined,
                  onDateChange: (value) => {
                    userStore.set("dateOfBirth", value);
                    userStore.resetError("dateOfBirth");
                  },
                  nullable: true,
                },
              },
              {
                label: "",
                variant: "empty",
                hidden: true,
              },
            ],
          },
        ],
      },
      {
        name: "Account Information",
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Username",
                variant: "text",
                required: true,
                placeholder: "Enter the username of the responsible",
                description:
                  "The username of the responsible. This will be used to access the responsible's account.",
                error: userStore.errors?.username?.[0],
                props: {
                  value: userStore.username || undefined,
                  onChange: (value) => {
                    userStore.set("username", value);
                    userStore.resetError("username");
                  },
                },
              },
            ],
          },
          {
            id: 2,
            fields: [
              {
                label: "Set User Password",
                variant: "check",
                description:
                  "Check this option if you want to set 's password manually or let us generate a random password and send it to them via email.",
                props: {
                  value: userStore.setManualPassword || undefined,
                  onCheckedChange: () => {
                    userStore.set(
                      "setManualPassword",
                      !userStore.setManualPassword
                    );
                    userStore.resetError("setManualPassword");
                  },
                },
              },
            ],
          },

          {
            id: 3,
            fields: [
              {
                label: "Password",
                variant: "password",
                required: true,
                description:
                  "The password of the responsible. This will be used to access the responsible's account.",
                error: userStore.errors?.password?.[0],
                hidden: !userStore.setManualPassword,
                props: {
                  value: userStore.password || undefined,
                  onChange: (value) => {
                    userStore.set("password", value);
                    userStore.resetError("password");
                  },
                },
              },
              {
                label: "Confirm Password",
                variant: "password",
                required: true,
                description:
                  "The password of the responsible. This will be used to access the responsible's account.",
                error: userStore.errors?.confirmPassword?.[0],
                hidden: !userStore.setManualPassword,
                props: {
                  value: userStore.confirmPassword || undefined,
                  onChange: (value) => {
                    userStore.set("confirmPassword", value);
                    userStore.resetError("confirmPassword");
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

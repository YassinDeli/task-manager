import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DynamicForm } from "@/types";
import React from "react";
import { RenderInputField } from "./RenderField";

interface FormBuilderProps {
  className?: string;
  form: DynamicForm;
  includeHeader?: boolean;
}

export const FormBuilder = ({
  className,
  form,
  includeHeader = false,
}: FormBuilderProps) => {
  return (
    <div className={cn("flex flex-col mx-4 sm:mx-6 md:mx-10", className)}>
      {includeHeader && (
        <div>
          <div className="space-y-1 py-5 sm:py-0">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {form.name}
            </h1>
            <p className="text-muted-foreground">{form.description}</p>
          </div>
          <Separator className="mt-2 mb-4 lg:mb-6" />
        </div>
      )}

      <form
        className="flex flex-col"
        onSubmit={() => {
          return false;
        }}
      >
        {form?.grids?.map((grid, index) => (
          <div key={index} className="flex flex-col gap-4 mb-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{grid.name}</h2>
              <Separator />
            </div>

            {grid?.gridItems?.map((gridItem) => {
              const fieldCount = gridItem.fields.length;

              return (
                <div
                  className={cn(
                    "grid gap-6 justify-between",
                    fieldCount === 1
                      ? "grid-cols-1"
                      : fieldCount === 2
                      ? "grid-cols-1 lg:grid-cols-2"
                      : fieldCount === 3
                      ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                      : fieldCount === 4
                      ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "w-full"
                  )}
                  key={gridItem.id}
                >
                  {gridItem.fields.map((field, index) => {
                    if (!field.hidden)
                      return (
                        <div
                          key={`${index}-${field.error}`}
                          className={cn("flex flex-col gap-2 w-full")}
                        >
                          {field.variant !== "check" && (
                            <Label
                              className={cn(
                                "text-sm font-semibold",
                                field?.error && "text-red-600"
                              )}
                              htmlFor={field.label}
                              required={field.required}
                            >
                              {field.label}
                            </Label>
                          )}
                          <RenderInputField field={field} />
                          <div className="flex justify-between">
                            <span className="text-xs opacity-70">
                              {field.description}
                            </span>
                            {field?.error && (
                              <span className="font-bold text-red-600 leading-0 text-xs mt-1 leading-3">
                                {field?.error}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </form>
    </div>
  );
};

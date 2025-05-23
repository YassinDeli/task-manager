import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface RenderInputFieldProps {
  field?: Field;
}

export const RenderInputField = ({ field }: RenderInputFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  switch (field?.variant) {
    case "text":
    case "email":
    case "tel":
    case "number":
      return (
        <Input
          className={field?.className}
          id={field.label}
          type={field.variant}
          placeholder={field.placeholder}
          value={field.props?.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            field?.props?.onChange?.(e.target.value)
          }
          {...field.props?.other}
        />
      );
    case "select":
      return (
        <Select
          onValueChange={field?.props?.onValueChange}
          value={field?.props?.value?.toString() || ""}
        >
          <SelectTrigger className={field?.className}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field?.props?.selectOptions?.map(
              (option: { label: string; value: string }) => (
                <SelectItem
                  key={option.label}
                  value={option.value}
                  className="mx-1"
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      );
    case "date":
      return (
        <DatePicker
          className={cn("w-full", field?.className)}
          value={
            (field?.props?.value &&
              new Date(field?.props?.value as string | Date | number)) ||
            undefined
          }
          onChange={(value: Date | null) => field?.props?.onDateChange?.(value)}
          nullable={field?.props?.nullable}
        />
      );
    case "check":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.label}
            className={field?.className}
            checked={field.props?.value as CheckedState}
            onCheckedChange={(value: CheckedState) =>
              field?.props?.onCheckedChange?.(value)
            }
          />
          <Label className={cn("text-sm font-semibold")} htmlFor={field.label}>
            {field.label}
          </Label>
        </div>
      );
    case "password":
      return (
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", field?.className)}
            value={field?.props?.value as string}
            onChange={(e) => field?.props?.onChange?.(e.target.value)}
            autoComplete="new-password"
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            variant={"link"}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      );
    case "textarea":
      return (
        <Textarea
          className={field?.className}
          placeholder={field.placeholder}
          value={field.props?.value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            field?.props?.onChange?.(e.target.value)
          }
          {...field.props?.other}
        />
      );
    default:
      return (
        <span className="text-xs text-red-500">Cannot Render Element</span>
      );
  }
};

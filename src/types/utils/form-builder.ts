import { CheckedState } from "@radix-ui/react-checkbox";

export interface DynamicForm {
  name: string;
  description?: string;
  grids: DynamicFormGrid[];
}

export interface DynamicFormGrid {
  name: string;
  gridItems: DynamicFormGridItems[];
}

export interface DynamicFormGridItems {
  id: number;
  fields: Field[];
}

export interface Field {
  label: string;
  className?: string;
  variant:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "password"
    | "date"
    | "select"
    | "checkbox"
    | "check"
    | "radio"
    | "textarea"
    | "empty"
    | "custom";
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
  error?: string;
  props?: {
    //this is for most variants
    value?: string | number | Date | boolean;
    //this is for input
    onChange?: (e: string) => void;
    //this is for date input
    onDateChange?: (e: Date | null) => void;
    //this is for date input nullable prop
    nullable?: boolean;
    //this is for checkbox & check
    onCheckedChange?: (e: CheckedState) => void;
    //this is for select
    onValueChange?: (value: string) => void;
    //this is for select & radios
    selectOptions?: { label: string; value: string }[];
    //this is for custom props
    other?: any;
  };
}

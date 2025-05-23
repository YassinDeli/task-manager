// types/validations/task.validation.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z.string().optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be one of: TODO, IN_PROGRESS, DONE",
  }),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be one of: LOW, MEDIUM, HIGH",
  }),
  projectId: z
    .number({
      required_error: "Please select a project", // Changed this line
      invalid_type_error: "Project must be a number",
    })
    .int({ message: "Project ID must be an integer" })
    .positive({ message: "Project ID must be positive" })
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a project", // And this line
    }),
   // Updated employee validation to match your form
   userId: z.string({
    required_error: "Please select an employee",
    invalid_type_error: "Employee must be selected",
  })
  .min(1, { message: "Please select an employee" }),

  dueDate: z
    .date()
    .nullable()
    .refine(
      (date) => !date || date >= new Date(new Date().setHours(0, 0, 0, 0)),
      { message: "Due date cannot be in the past" }
    ),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

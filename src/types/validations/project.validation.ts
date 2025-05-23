import { z } from "zod";
import { employeeSchema } from "./entreprise.validation";

// Helper function to check if date is in the future
const isFutureDate = (date: Date) => {
  return date >= new Date(new Date().setHours(0, 0, 0, 0));
};

export const projectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().nullable().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date()
    .nullable()
    .optional()
    .refine(
      date => !date || isFutureDate(date),
      { message: "End date cannot be in the past" }
    ),
}).refine(
  data => !data.endDate || data.endDate >= data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"] // This shows the error on the endDate field
  }
);
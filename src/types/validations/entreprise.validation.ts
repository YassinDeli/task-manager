import { z } from "zod";

export const entrepriseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(3, { message: "Invalid E-mail, must be at least 3 characters long" })
    .email({ message: "Invalid E-mail format" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

export const employeeSchema = z.object({
  phone: z.string().min(1, { message: "Phone number is required" }),
});

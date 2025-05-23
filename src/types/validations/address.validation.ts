import { z } from "zod";

export const addressSchema = z.object({
  address: z
    .string({ message: "Address is required" })
    .min(1, { message: "Address is too short" }),
  address2: z.string().optional(),
  region: z
    .string({ message: "Region is required" })
    .min(1, { message: "Region is too short" }),
  zipcode: z
    .string({ message: "Zip Code is required" })
    .min(1, { message: "Zip Code is too short" }),
  countryId: z.number({ message: "Country is required" }),
});

import { z } from "zod";

export const searchDistrictSchema = {
  params: z.object({
    stateId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid state id."),
  }),
  query: z.object({
    search: z.string().trim().min(2, "Enter at least 2 characters").optional(),

    limit: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 20))
      .refine((value) => Number.isInteger(value) && value > 0 && value <= 50, {
        message: "Limit must be between 1 and 50",
      }),
  }),
};

export const searchVillageSchema = {
  params: z.object({
    districtId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid district id."),
  }),
  query: z.object({
    search: z.string().trim().min(2, "Enter at least 2 characters").optional(),

    limit: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 20))
      .refine((value) => Number.isInteger(value) && value > 0 && value <= 50, {
        message: "Limit must be between 1 and 50",
      }),
  }),
};

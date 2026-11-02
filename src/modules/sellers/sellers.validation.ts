import z from "zod";

export const latitude = z.coerce
  .number()
  .min(-90, "Latitude must be at least -90.")
  .max(90, "Latitude must not exceed 90.").optional();

export const longitude = z.coerce
  .number()
  .min(-180, "Longitude must be at least -180.")
  .max(180, "Longitude must not exceed 180.").optional();

export const radiusInKm = z.coerce
  .number()
  .positive("Radius must be greater than 0.")
  .max(100, "Radius cannot exceed 100 km.")
  .default(10).optional();

export const limit = z.coerce
  .number()
  .int("Limit must be an integer.")
  .min(1, "Limit must be at least 1.")
  .max(50, "Limit cannot exceed 50.")
  .default(20);

export const scope = z.enum([
  "HABITATION",
  "MAUJA",
  "VILLAGE",
  "BLOCK",
  "DISTRICT",
  "STATE",
]).optional();

export const sellersListingQuery = {
  query: z.object({
    latitude,
    longitude,
    radiusInKm,
    limit,
    scope,
    stateId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid state id.")
      .optional(),
    districtId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid district id.")
      .optional(),
    blockId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid block id.")
      .optional(),
    villageId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid village id.")
      .optional(),
    maujaId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid mauja id.")
      .optional(),
    habitationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid habitation id.")
      .optional(),
    vegetableIds: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid vegetable id.")
      .optional(),
    cursor: z.string().min(1, "Cursor cannot be empty.").optional(),
  }),
};

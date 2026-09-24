import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "./user.constants";
import { SupportedLanguage } from "./user.types";

export const updateProfileSchema = {
  body: z
    .object({
      fullName: z.string().trim().min(2).max(100).optional(),

      preferredLanguage: z
        .enum(
          Object.values(SUPPORTED_LANGUAGES) as [
            SupportedLanguage,
            ...SupportedLanguage[],
          ],
        )
        .optional(),

      location: z
        .object({
          villageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid village id."),
          districtId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid district id."),
          stateId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid state id."),
          pincode: z.string().regex(/^\d{6}$/),
        })
        .optional(),
      geoLocation: z
        .object({
          type: z.literal("Point"),
          coordinates: z.tuple([
            z.number().min(-180).max(180),
            z.number().min(-90).max(90),
          ]),
        })
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update.",
    }),
};

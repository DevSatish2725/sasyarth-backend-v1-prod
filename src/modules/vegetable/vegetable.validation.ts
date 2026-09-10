import { z } from "zod";
import { VEGETABLE_CATEGORIES, VEGETABLE_UNITS } from "./vegetable.constants";

const vegetableUnitSchema = z.enum([
  VEGETABLE_UNITS.KG,
  VEGETABLE_UNITS.PIECE,
  VEGETABLE_UNITS.BUNDLE,
  VEGETABLE_UNITS.DOZEN,
]);

export const createVegetableSchema = {
  body: z
    .object({
      name: z.string().trim().min(2, "Vegetable name is required."),

      displayNames: z.object({
        en: z.string().trim().min(2, "English display name is required."),

        hi: z.string().trim().min(1, "Hindi display name is required."),
      }),

      category: z.enum([VEGETABLE_CATEGORIES.VEGETABLE]),

      defaultUnit: vegetableUnitSchema,

      allowedUnits: z
        .array(vegetableUnitSchema)
        .min(1, "At least one unit is required.")
        .refine(
          (units) => new Set(units).size === units.length,
          "Duplicate units are not allowed.",
        ),

      image: z
        .url({
          message: "Invalid image URL.",
        })
        .optional(),
    })
    .refine((data) => data.allowedUnits.includes(data.defaultUnit), {
      path: ["defaultUnit"],
      message: "Default unit must be one of the allowed units.",
    }),
};

export const updateVegetableSchema = {
  body: z
    .object({
      name: z.string().trim().min(2, "Vegetable name is required.").optional(),

      displayNames: z
        .object({
          en: z
            .string()
            .trim()
            .min(2, "English display name is required.")
            .optional(),

          hi: z
            .string()
            .trim()
            .min(1, "Hindi display name is required.")
            .optional(),
        })
        .optional(),

      category: z.enum([VEGETABLE_CATEGORIES.VEGETABLE]).optional(),

      defaultUnit: vegetableUnitSchema.optional(),

      allowedUnits: z
        .array(vegetableUnitSchema)
        .min(1, "At least one unit is required.")
        .refine(
          (units) => new Set(units).size === units.length,
          "Duplicate units are not allowed.",
        )
        .optional(),

      image: z
        .url({
          message: "Invalid image URL.",
        })
        .optional(),
    })
    .refine(
      (data) => {
        if (data.defaultUnit === undefined || data.allowedUnits === undefined) {
          return true;
        }

        return data.allowedUnits.includes(data.defaultUnit);
      },
      {
        path: ["defaultUnit"],
        message: "Default unit must be one of the allowed units.",
      },
    ),
};

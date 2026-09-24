import { z } from "zod";
import { SELLER_RATING_TAGS } from "./sellerRating.constants";

export const sellerIdSchema = {
  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller id."),
  }),
};

export const createSellerRatingSchema = {
  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller id."),
  }),

  body: z.object({
    rating: z.number().int().min(1).max(5),

    tags: z.array(z.enum(SELLER_RATING_TAGS)).max(5).default([]),
  }),
};

export const updateSellerRatingSchema = {
  params: z.object({
    sellerId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid seller id.",
      ),
  }),

  body: z
    .object({
      rating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional(),

      tags: z
        .array(
          z.enum(SELLER_RATING_TAGS),
        )
        .max(5)
        .optional(),
    })
    .refine(
      (data) =>
        data.rating !== undefined ||
        data.tags !== undefined,
      {
        message:
          "At least one field is required.",
      },
    ),
};

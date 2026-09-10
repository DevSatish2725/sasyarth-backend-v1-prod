import z from "zod";

export const createSellerReviewSchema = {
  body: z
    .object({
      rating: z.number().int().min(1).max(5),

      comment: z.string().trim().max(500).optional(),
    })
    .strict(),
};

export type CreateSellerReviewDto = z.infer<
  typeof createSellerReviewSchema.body
>;

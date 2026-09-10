import { z } from "zod";

export const savedSellerParamsSchema = {
  params: z.object({
    sellerProfileId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid seller profile id."),
  }),
};

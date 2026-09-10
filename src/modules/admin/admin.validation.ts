import { z } from "zod";
import { SELLER_VERIFICATION_STATUS } from "../seller/seller.constants";

export const adminSellerListSchema = {
  query: z.object({
    status: z
      .enum([
        SELLER_VERIFICATION_STATUS.PENDING,
        SELLER_VERIFICATION_STATUS.VERIFIED,
        SELLER_VERIFICATION_STATUS.REJECTED,
      ])
      .default(SELLER_VERIFICATION_STATUS.PENDING),
  }),
};

export const adminSellerParamsSchema = {
  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller ID."),
  }),
};

export const rejectSellerSchema = {
  body: z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(5, "Rejection reason must be at least 5 characters.")
      .max(500, "Rejection reason cannot exceed 500 characters."),
  }),

  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller ID."),
  }),
};

export const blockSellerSchema = {
  body: z.object({
    blockReason: z
      .string()
      .trim()
      .min(5, "Block reason must be at least 5 characters.")
      .max(500, "Block reason cannot exceed 500 characters."),
  }),

  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller ID."),
  }),
};

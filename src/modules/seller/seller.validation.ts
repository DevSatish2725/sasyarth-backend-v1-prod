import { z } from "zod";
import {
  BUSINESS_TYPES,
  DOCUMENT_TYPES,
  SELLER_VERIFICATION_STATUS,
} from "./seller.constants";
import {
  BusinessTypes,
  DocumentTypes,
  SellerVerificationStatus,
} from "./seller.types";
import { SupportedLanguage } from "../users/user.types";
import { SUPPORTED_LANGUAGES } from "../users/user.constants";

const verificationDocumentSchema = z.object({
  type: z.enum(
    Object.values(DOCUMENT_TYPES) as [DocumentTypes, ...DocumentTypes[]],
  ),
  url: z.url({
    message: "Invalid url",
  }),
});

const applyBodySchema = z.object({
  businessType: z.enum(
    Object.values(BUSINESS_TYPES) as [BusinessTypes, ...BusinessTypes[]],
  ),
  documents: z
    .array(verificationDocumentSchema)
    .min(1, "At least 1 document is required for verification."),
  preferredLanguage: z.enum(
    Object.values(SUPPORTED_LANGUAGES) as [
      SupportedLanguage,
      ...SupportedLanguage[],
    ],
  ),
  location: z.object({
    village: z.string().trim().min(2),
    district: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  }),
  geoLocation: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
      ]),
    })
    .strict()
    .optional(),
});

export const applySchema = {
  body: applyBodySchema,
};

export const reApplySchema = {
  body: applyBodySchema
    .partial()
    .refine((data) => Object.values(data).length > 0, {
      message: "At least 1 field is required for update",
    }),
};

export const sellerSchemaId = {
  params: z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid seller id."),
  }),
};

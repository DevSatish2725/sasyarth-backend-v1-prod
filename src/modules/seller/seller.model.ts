import { Schema, Types, model } from "mongoose";
import {
  BUSINESS_TYPES,
  SELLER_STATUS,
  SELLER_VERIFICATION_STATUS,
} from "./seller.constants";
import { SellerDocumentsSchema } from "../../shared/schemas/seller.documents";
import { SellerEntity } from "./seller.types";

  export const SellerSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
      },
      businessType: {
        type: String,
        enum: Object.values(BUSINESS_TYPES),
        default: BUSINESS_TYPES.INDIVIDUAL_FARMER,
        required: true,
      },
      verificationStatus: {
        type: String,
        enum: Object.values(SELLER_VERIFICATION_STATUS),
        default: SELLER_VERIFICATION_STATUS.NOT_APPLIED,
        required: true,
      },
      documents: {
        type: [SellerDocumentsSchema],
        required: true,
      },
      sellerStatus: {
        type: String,
        enum: Object.values(SELLER_STATUS),
        default: SELLER_STATUS.ACTIVE,
        required: true,
      },
      reviewedBy: {
        type: Schema.Types.ObjectId,
      },
      reviewedAt: {
        type: Date,
      },
      rejectionReason: {
        type: String,
      },
      blockReason: {
        type: String,
      },
    },
    { timestamps: true, versionKey: false },
  );

export const Seller = model<SellerEntity>("Seller", SellerSchema);

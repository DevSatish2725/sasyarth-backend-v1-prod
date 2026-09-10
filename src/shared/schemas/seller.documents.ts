import { Schema } from "mongoose";
import { DOCUMENT_TYPES } from "../../modules/seller/seller.constants";

export const SellerDocumentsSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(DOCUMENT_TYPES),
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { _id: false },
);

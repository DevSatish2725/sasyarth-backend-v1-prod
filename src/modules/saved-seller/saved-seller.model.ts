import { Schema, model, Types } from "mongoose";
import { SavedSellerTypes } from "./saved-seller.types";

const SavedSellerSchema = new Schema<SavedSellerTypes>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

SavedSellerSchema.index(
  {
    buyerId: 1,
    sellerProfileId: 1,
  },
  {
    unique: true,
  },
);

export const SavedSeller = model<SavedSellerTypes>(
  "SavedSeller",
  SavedSellerSchema,
);

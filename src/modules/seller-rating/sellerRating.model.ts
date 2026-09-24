import { Schema, model, Types } from "mongoose";
import { ISellerRating } from "./sellerRating.types";
import { SELLER_RATING_TAGS } from "./sellerRating.constants";

const sellerRatingSchema = new Schema<ISellerRating>(
  {
    buyerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "SellerProfile",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    tags: {
      type: [String],
      enum: SELLER_RATING_TAGS,
      default: [],
    },

    contactInteractionId: {
      type: Schema.Types.ObjectId,
      ref: "ContactInteraction",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

sellerRatingSchema.index(
  {
    buyerUserId: 1,
    sellerProfileId: 1,
  },
  {
    unique: true,
  },
);

export const SellerRatingModel = model<ISellerRating>(
  "SellerRating",
  sellerRatingSchema,
);

import { Schema, model, Types } from "mongoose";

const SellerReviewSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

SellerReviewSchema.index({ orderId: 1 }, { unique: true });

SellerReviewSchema.index({
  sellerProfileId: 1,
});

export const SellerReview = model("SellerReview", SellerReviewSchema);

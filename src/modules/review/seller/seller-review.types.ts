import { Types } from "mongoose";

export interface SellerReview {
  orderId: Types.ObjectId;

  buyerId: Types.ObjectId;

  sellerProfileId: Types.ObjectId;

  rating: number;

  comment?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateSellerReviewPayload = {
  orderId: Types.ObjectId;
  buyerId: Types.ObjectId;
  sellerProfileId: Types.ObjectId;

  rating: number;

  comment?: string;
};

export type SellerReviewListEntity = {
  _id: Types.ObjectId;

  buyer: {
    fullName: string;
  };

  rating: number;

  comment?: string | null;

  createdAt: Date;
};

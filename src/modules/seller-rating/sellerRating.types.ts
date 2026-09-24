import { Types } from "mongoose";
import { RATING_ELIGIBILITY_REASON, SELLER_RATING_TAGS } from "./sellerRating.constants";

export type SellerRatingTag = (typeof SELLER_RATING_TAGS)[number];

export interface ISellerRating {
  buyerUserId: Types.ObjectId;
  sellerProfileId: Types.ObjectId;
  rating: number;
  tags: SellerRatingTag[];
  contactInteractionId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type RatingEligibilityReason =
  (typeof RATING_ELIGIBILITY_REASON)[keyof typeof RATING_ELIGIBILITY_REASON];

export interface MySellerRating {
  _id: string;
  rating: number;
  tags: SellerRatingTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MySellerRatingStatus {
  hasRated: boolean;
  canRate: boolean;
  eligibleAt: Date | null;
  reason?: RatingEligibilityReason;
  rating: MySellerRating | null;
}

export interface RatingSummaryAggregation {
  ratingSummary: {
    averageRating: number;
    ratingCount: number;
  }[];

  tagSummary: {
    _id: string;
    count: number;
  }[];
}

export interface SellerRatingSummary {
  averageRating: number;
  ratingCount: number;
  tagCounts: Record<string, number>;
}

export interface UpdateSellerRatingPayload {
  rating?: number;
  tags?: SellerRatingTag[];
}


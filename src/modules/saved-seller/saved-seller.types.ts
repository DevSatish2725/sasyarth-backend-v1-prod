import { Types } from "mongoose";
import { SELLER_AVAILABILITY_STATUS } from "./saved-seller.constants";

export interface SavedSellerTypes {
  buyerId: Types.ObjectId;
  sellerProfileId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SavedSellerBuyerEntity = {
  buyerId: Types.ObjectId;
};

export type SellerAvailabilityStatus =
  (typeof SELLER_AVAILABILITY_STATUS)[keyof typeof SELLER_AVAILABILITY_STATUS];

export interface SavedSellerListEntity {
  _id: Types.ObjectId;

  sellerProfileId: Types.ObjectId;

  savedAt: Date;

  availabilityStatus: SellerAvailabilityStatus;

  seller: {
    fullName: string | null;

    location: {
      village: string;
      district: string;
      state: string;
      pincode: string;
    } | null;

    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | null;

    averageRating: number;

    ratingCount: number;
  };

  availableVegetables: {
    id: Types.ObjectId;
    name: string;
  }[];
}

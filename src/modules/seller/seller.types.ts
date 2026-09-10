import { HydratedDocument, InferSchemaType, Model } from "mongoose";
import {
  SELLER_VERIFICATION_STATUS,
  DOCUMENT_TYPES,
  BUSINESS_TYPES,
  SELLER_STATUS,
} from "./seller.constants";
import { SellerSchema } from "./seller.model";
import { Types } from "mongoose";

export type SellerVerificationStatus =
  (typeof SELLER_VERIFICATION_STATUS)[keyof typeof SELLER_VERIFICATION_STATUS];

export type DocumentTypes =
  (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export type BusinessTypes =
  (typeof BUSINESS_TYPES)[keyof typeof BUSINESS_TYPES];

export type SellerStatus = (typeof SELLER_STATUS)[keyof typeof SELLER_STATUS];

export type SellerEntity = InferSchemaType<typeof SellerSchema>;

export type SellerDocument = HydratedDocument<SellerEntity>;

export type SellerWithUserEntity = {
  _id: Types.ObjectId;

  userId: {
    _id: Types.ObjectId;
    fullName: string;
    mobileNumber: string;
    location: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    }
  };
};

export interface VerificationDocument {
  type: DocumentTypes;
  url: string;
  uploadedAt: Date;
}

export type VerificationDocumentsList = VerificationDocument[];

export type SellerSearchScope = "village" | "district" | "state";

export interface GetSellerListingParams {
  userId?: string;
  scope?: SellerSearchScope;
  state?: string;
  district?: string;
  village?: string;
  vegetableIds?: string[];
  latitude?: number | undefined;
  longitude?: number | undefined;
  radiusInKm?: number;
  limit?: number;
}

export interface BroadSellerPipelineParams {
  scope: SellerSearchScope;
  state: string;
  district?: string;
  village?: string;
  normalizedVegetableIds?: Types.ObjectId[];
  userId?: Types.ObjectId;
  today: Date;
  limit: number;
}
export interface SellerListingCursor {
  distanceMeters: number;
  sellerId: string;
}

export interface PopulatedSellerUser {
  _id: string;
  fullName: string;
  mobileNumber: string;
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
}

export type SellerWithPersonalDetails = Omit<SellerEntity, "userId"> & {
  _id: string;
  userId: PopulatedSellerUser;
};

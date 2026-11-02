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
    };
  };
};

export interface VerificationDocument {
  type: DocumentTypes;
  url: string;
  uploadedAt: Date;
}

export type VerificationDocumentsList = VerificationDocument[];
export interface GetSellerListingParams {
  userId: string;
  stateId?: string | undefined;
  districtId?: string | undefined;
  blockId?: string | undefined;
  villageId?: string | undefined;
  maujaId?: string | undefined;
  habitationId?: string | undefined;
  vegetableIds?: string[];
  latitude?: number | undefined;
  longitude?: number | undefined;
  radiusInKm?: number;
  limit?: number;
  cursor?: string | undefined;
}

export interface BroadSellerPipelineParams {
  stateId: string | undefined;
  districtId: string | undefined;
  blockId: string | undefined;
  villageId: string | undefined;
  maujaId: string | undefined;
  habitationId: string | undefined;

  normalizedVegetableIds?: Types.ObjectId[];

  today: Date;

  userId: string;

  limit: number;

  cursor?: SellerListingCursor;
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

export type SellerAdminDetails = Omit<SellerEntity, "userId"> & {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    mobileNumber: string;
    location: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    };
  };
};

export interface SellerListingCursor {
  updatedAt: Date;
  sellerId: Types.ObjectId;
}

export interface SellerCursorPayload {
  updatedAt: string;
  sellerId: string;
}

export interface PublicSellerPipelineParams {
  normalizedVegetableIds?: Types.ObjectId[];
  today: Date;
  limit: number;
  userId: string;
  cursor?: SellerListingCursor;
}

export interface VillageSellerPipelineParams {
  state: string;
  district: string;
  village: string;

  normalizedVegetableIds?: Types.ObjectId[];

  today: Date;

  limit: number;

  userId: string;

  cursor?: SellerListingCursor;
}

export interface GeoSellerCursor {
  distanceInMeters: number;
  sellerId: Types.ObjectId;
}

export interface GeoSellerPipelineParams {
  longitude: number;
  latitude: number;
  radiusInKm: number;

  normalizedVegetableIds?: Types.ObjectId[];

  today: Date;

  limit: number;

  userId: string;

  cursor?: GeoSellerCursor;
}

export interface GeoSellerCursorPayload {
  distanceInMeters: number;
  sellerId: string;
}

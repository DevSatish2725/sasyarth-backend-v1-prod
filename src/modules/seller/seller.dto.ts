import { Types } from "mongoose";
import {
  VerificationDocumentsList,
  BusinessTypes,
  SellerVerificationStatus,
  DocumentTypes,
  VerificationDocument,
} from "./seller.types";

export interface applySellerDto {
  userId: Types.ObjectId;
  businessType: BusinessTypes;
  verificationStatus: SellerVerificationStatus;
  documents: VerificationDocument[];
}

export interface applySellerWithLocationDto extends applySellerDto {
  location: {
    stateId: string;
    districtId: string;
    villageId: string;
    habitationId: string;
    maujaId: string;
    blockId: string;
    pincode: string;
  };
  geoLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface reApplySellerDto {
  businessType?: BusinessTypes;
  documents?: VerificationDocument[];
}
export interface SellerProfileDto {
  sellerId: string;
  businessType: BusinessTypes;
  verificationStatus: SellerVerificationStatus;
  documents: VerificationDocumentsList;
}

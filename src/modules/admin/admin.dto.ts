import {
  BusinessTypes,
  SellerVerificationStatus,
  VerificationDocument,
  SellerStatus,
  PopulatedSellerUser,
} from "../seller/seller.types";

export interface AdminSellerListDto {
  id: string;
  personalDetails: PopulatedSellerUser;
  businessType: BusinessTypes;
  verificationStatus: SellerVerificationStatus;
  sellerStatus?: SellerStatus;
  documents: VerificationDocument[];
  rejectionReason?: string;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSellerDto {
  id: string;
  userId: string;
  businessType: BusinessTypes;
  verificationStatus: SellerVerificationStatus;
  sellerStatus?: SellerStatus;
  documents: VerificationDocument[];
  rejectionReason?: string;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

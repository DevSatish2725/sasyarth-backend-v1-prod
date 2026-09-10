import { SellerDocument, SellerWithPersonalDetails } from "../seller/seller.types";
import { AdminSellerDto, AdminSellerListDto } from "./admin.dto";

export const toAdminSellerListDto = (
  seller: SellerWithPersonalDetails,
): AdminSellerListDto => ({
  id: seller._id,
  personalDetails: seller.userId,
  businessType: seller.businessType,
  verificationStatus: seller.verificationStatus,
  documents: seller.documents,
  ...(seller.rejectionReason
    ? { rejectionReason: seller.rejectionReason }
    : {}),
  ...(seller.blockReason ? { blockReason: seller.blockReason } : {}),
  ...(seller.sellerStatus ? {sellerStatus: seller.sellerStatus} : {}),
  createdAt: seller.createdAt,
  updatedAt: seller.updatedAt,
});

export const toAdminSellerDto = (
  seller: SellerDocument,
): AdminSellerDto => ({
  id: seller.id,
  userId: seller.userId.toString(),
  businessType: seller.businessType,
  verificationStatus: seller.verificationStatus,
  documents: seller.documents,
  ...(seller.rejectionReason
    ? { rejectionReason: seller.rejectionReason }
    : {}),
  ...(seller.blockReason ? { blockReason: seller.blockReason } : {}),
  ...(seller.sellerStatus ? {sellerStatus: seller.sellerStatus} : {}),
  createdAt: seller.createdAt,
  updatedAt: seller.updatedAt,
});

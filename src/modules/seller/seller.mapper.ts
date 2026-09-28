import { SellerProfileDto } from "./seller.dto";
import { SellerAdminDetails, SellerDocument, SellerWithUserEntity } from "./seller.types";

export const toSellerProfileDto = (
  seller: SellerDocument,
): SellerProfileDto => {
  return {
    sellerId: seller._id.toString(),
    businessType: seller.businessType,
    verificationStatus: seller.verificationStatus,
    documents: seller.documents,
  };
};

export const toSellerAdminDto = (
  seller: SellerAdminDetails,
): SellerProfileDto => {
  return {
    sellerId: seller._id.toString(),
    businessType: seller.businessType,
    verificationStatus: seller.verificationStatus,
    documents: seller.documents,
  };
};

export const toCallSellerDetails = (seller: SellerWithUserEntity) => ({
  fullName: seller.userId.fullName,
  mobileNumber: seller.userId.mobileNumber,
  location: seller.userId.location
})

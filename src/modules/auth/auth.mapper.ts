import { LocationDetails } from "../location/location.types";
import { SellerDocument } from "../seller/seller.types";
import { UserDocument } from "../users/user.types";
import { AuthUserResponse, UserProfileResponse } from "./auth.types";

export const mapAuthUserResponse = (user: UserDocument): AuthUserResponse => {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    accountType: user.accountType,
    preferredLanguage: user.preferredLanguage,

    location: user.location
      ? {
          stateId: user.location.stateId.toString(),
          districtId: user.location.districtId.toString(),
          blockId: user.location.blockId.toString(),
          villageId: user.location.villageId.toString(),
          maujaId: user.location.maujaId.toString(),
          habitationId: user.location.habitationId.toString(),
          pincode: user.location.pincode,
        }
      : null,

    isPhoneVerified: user.isPhoneVerified,
    status: user.status,
  };
};

export const mapUserProfileResponse = (
  user: UserDocument,
  sellerProfile: SellerDocument | null,
  locationDetails: LocationDetails | null,
): UserProfileResponse => {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    mobileNumber: user.mobileNumber,
    accountType: user.accountType,
    preferredLanguage: user.preferredLanguage,

    location:
      user.location && locationDetails
        ? {
            ...locationDetails,
            pincode: user.location.pincode,
          }
        : null,

    sellerProfile: sellerProfile
      ? {
          sellerId: sellerProfile._id.toString(),
          verificationStatus: sellerProfile.verificationStatus,
          ...(sellerProfile.rejectionReason
            ? { rejectionReason: sellerProfile.rejectionReason }
            : {}),
          ...(sellerProfile.reviewedAt
            ? { reviewedAt: sellerProfile.reviewedAt }
            : {}),
          businessType: sellerProfile.businessType,
        }
      : null,

    isPhoneVerified: user.isPhoneVerified,
    status: user.status,
  };
};

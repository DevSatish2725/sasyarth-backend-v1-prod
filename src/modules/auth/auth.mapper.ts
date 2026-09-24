import { LocationWithIds } from "../location/location.types";
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
          village: user.location.village,
          district: user.location.district,
          state: user.location.state,
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
  locationWithIds: LocationWithIds | null,
): UserProfileResponse => {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    mobileNumber: user.mobileNumber,
    accountType: user.accountType,
    preferredLanguage: user.preferredLanguage,

    location:
      user.location && locationWithIds
        ? {
            village: {
              id: locationWithIds.village.id,
              name: locationWithIds.village.name,
            },
            district: {
              id: locationWithIds.district.id,
              name: locationWithIds.district.name,
            },
            state: {
              id: locationWithIds.state.id,
              name: locationWithIds.state.name,
            },
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

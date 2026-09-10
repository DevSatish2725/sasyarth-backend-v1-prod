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

export const mapUserProfileResponse = (user: UserDocument, sellerProfile: SellerDocument | null): UserProfileResponse => {
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
    
    sellerProfile: sellerProfile ? {
      sellerId: sellerProfile._id.toString()
    } :null,

    isPhoneVerified: user.isPhoneVerified,
    status: user.status,
  };
};
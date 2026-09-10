import { UserProfileDto } from "./user.dto";
import { UserDocument } from "./user.types";

export const toUserProfileDto = (user: UserDocument): UserProfileDto => ({
  id: user.id,
  fullName: user.fullName,
  mobileNumber: user.mobileNumber,
  accountType: user.accountType,
  preferredLanguage: user.preferredLanguage,
  isPhoneVerified: user.isPhoneVerified,
  ...(user.location
    ? {
        location: user.location,
      }
    : {}),

  ...(user.geoLocation
    ? {
        geoLocation: user.geoLocation,
      }
    : {}),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

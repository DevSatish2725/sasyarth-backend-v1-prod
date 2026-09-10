import { SupportedLanguage, UserAccountType } from "./user.types";

export interface Location {
  village: string;
  district: string;
  state: string;
  pincode: string;
}

export interface GeoLocation {
  type: string;
  coordinates: Number[];
}

export interface UpdateProfileDto {
  fullName?: string;

  preferredLanguage?: SupportedLanguage;

  location?: Location;

  geoLocation?: GeoLocation;
}

export interface UserProfileDto {
  id: string;
  fullName: string;
  mobileNumber: string;
  accountType: UserAccountType;
  preferredLanguage: SupportedLanguage;
  isPhoneVerified: boolean;
  location?: Location;
  geoLocation?: GeoLocation;
  createdAt: Date;
  updatedAt: Date;
}

import { SupportedLanguage, UserAccountType } from "./user.types";

export interface LocationPayload {
  villageId: string;
  districtId: string;
  stateId: string;
  pincode: string;
}

export interface Location {
  state: string;
  district: string;
  village: string;
  pincode: string;
}

export interface GeoLocation {
  type: string;
  coordinates: Number[];
}

export interface UpdateProfilePayloadDto {
  fullName?: string;

  preferredLanguage?: SupportedLanguage;

  location?: LocationPayload;

  geoLocation?: GeoLocation;
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

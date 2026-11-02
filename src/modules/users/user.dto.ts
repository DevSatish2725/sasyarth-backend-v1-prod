import { Types } from "mongoose";
import { SupportedLanguage, UserAccountType } from "./user.types";

export interface LocationPayload {
  stateId: string;
  districtId: string;
  blockId: string;
  villageId: string;
  maujaId: string;
  habitationId: string;
  pincode: string;
}

export interface Location {
  stateId: Types.ObjectId | null;
  districtId: Types.ObjectId | null;
  blockId: Types.ObjectId | null;
  villageId: Types.ObjectId | null;
  maujaId: Types.ObjectId | null;
  habitationId: Types.ObjectId | null;
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

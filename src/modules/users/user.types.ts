import type { HydratedDocument, InferSchemaType } from "mongoose";
import { UserSchema } from "./user.model";
import type { IUserMethods } from "./user.methods";

import {
  USER_ACCOUNT_TYPES,
  USER_STATUS,
  SUPPORTED_LANGUAGES,
} from "./user.constants.js";

export type UserAccountType =
  (typeof USER_ACCOUNT_TYPES)[keyof typeof USER_ACCOUNT_TYPES];

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

export type UserEntity = InferSchemaType<typeof UserSchema>;

export type UserDocument = HydratedDocument<UserEntity, IUserMethods>;

export interface UpdateLocationPayload {
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };

  geoLocation?: {
    type: "Point";
    coordinates: [number, number];
  };
}

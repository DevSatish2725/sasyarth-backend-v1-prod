import { Schema, model } from "mongoose";
import {
  SUPPORTED_LANGUAGES,
  USER_ACCOUNT_TYPES,
  USER_STATUS,
} from "./user.constants";
import { LocationSchema } from "../../shared/schemas/location.schema";
import { UserModel } from "./user.methods";
import { UserEntity } from "./user.types";
import { GeoLocationSchema } from "../../shared/schemas/geolocation.schema";

export const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      select: false
    },
    accountType: {
      type: String,
      enum: Object.values(USER_ACCOUNT_TYPES),
      default: USER_ACCOUNT_TYPES.USER,
      required: true,
    },
    preferredLanguage: {
      type: String,
      enum: Object.values(SUPPORTED_LANGUAGES),
      default: SUPPORTED_LANGUAGES.ENGLISH,
    },
    location: {
      type: LocationSchema,
    },
    geoLocation: {
      type: GeoLocationSchema,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false },
);

UserSchema.index(
  {
    mobileNumber: 1,
  },
  {
    unique: true,
  },
);

UserSchema.index({
  geoLocation: "2dsphere",
});

UserSchema.set("toJSON", {
  transform(_doc, ret) {
    return ret;
  },
});

UserSchema.set("toObject", {
  transform(_doc, ret) {
    return ret;
  },
});

export const User = model<UserEntity, UserModel>("User", UserSchema);

import { UserDocument, UserStatus } from "../users/user.types";
import { SupportedLanguage, UserAccountType } from "../users/user.types";

export interface VerifyOtpDto {
  mobileNumber: string;
  otp: string;
}

export interface RegisterDto {
  fullName: string;
  password: string;
}


export interface AuthUserResponse {
  id: string;
  fullName: string;
  accountType: UserAccountType;
  preferredLanguage: SupportedLanguage;

  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  } | null;

  isPhoneVerified: boolean;
  status: UserStatus;
}
export interface AuthResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}
export interface LoginDto {
  mobileNumber: string;
  otp: string;
}



export interface AuthUser {
  userId: string;
  accountType: UserAccountType;
}

export type SellerId = string;

export interface UserProfileResponse extends AuthUserResponse {
  sellerProfile: {
    sellerId: string;
  } | null;
}
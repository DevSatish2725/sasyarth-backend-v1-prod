/**
 * AuthService
 *
 * Purpose:
 * Handles authentication business logic.
 *
 * Responsibilities:
 * - Coordinate the complete authentication workflow.
 * - Communicate with UserRepository for user-related database operations.
 * - Communicate with OtpService for OTP generation and verification.
 * - Generate authentication tokens.
 * - Handle login, registration, refresh token and logout logic.
 *
 * This service should NEVER:
 * - Access the database directly.
 * - Access otpStore directly.
 * - Hash passwords.
 * - Hash OTPs.
 *
 * It only coordinates different services and repositories.
 */

import { ApiError } from "../../utils/ApiError";
import { otpService } from "../../services/otp/otp.service";
import { smsService } from "../../services/sms/sms.service";
import { AUTH_MESSAGES } from "./auth.constants";
import { jwtService } from "../../services/jwt";
import { JWT_PURPOSE } from "../../services/jwt/jwt.constants";
import {
  AuthResponse,
  LoginDto,
  Msg91LoginInput,
  RegisterDto,
  VerifyOtpDto,
} from "./auth.types";
import { userRepository } from "../users/user.repository";
import { USER_STATUS } from "../users/user.constants";
import { locationRepository } from "../location/location.repository";
import { logger } from "../../config/logger";
import { sellerRepository } from "../seller/seller.repository";
import { mapAuthUserResponse, mapUserProfileResponse } from "./auth.mapper";
import { User } from "../users/user.model";
import { LocationWithIds } from "../location/location.types";
import { verifyMsg91AccessToken } from "./providers/msg91.provider";
import { normalizeIndianMobile } from "../../utils/normalizedIndianMobileNumber";

class AuthService {
  async registerSendOtp(mobileNumber: string) {
    const user = await userRepository.findByPhone(mobileNumber);
    if (user) {
      throw new ApiError(
        409,
        "User already exist with provided mobile number.",
      );
    }
  }

  async loginSendOtp(mobileNumber: string) {
    const user = await userRepository.findByPhone(mobileNumber);
    if (!user) {
      throw new ApiError(
        409,
        "User doesn't exist with provided mobile number. Create an account.",
      );
    }
  }

  async verifyMsg91Otp(
    dto: VerifyOtpDto,
  ): Promise<{ mobileNumber: string; registrationToken: string | null }> {
    const { msgAccessToken } = dto;

    const result = await verifyMsg91AccessToken(msgAccessToken);

    const identifier = result.message;

    if (!identifier || typeof identifier !== "string") {
      throw new ApiError(401, "Unable to identify verified mobile number.");
    }

    const mobileNumber = normalizeIndianMobile(identifier);

    const exists = await userRepository.existsByPhone(mobileNumber);

    if (exists) {
      throw new ApiError(400, "User already exist.");
    }

    const registrationToken = jwtService.generateRegistrationToken({
      sub: mobileNumber,
      purpose: JWT_PURPOSE.REGISTRATION,
    });

    return {
      mobileNumber,
      registrationToken,
    };
  }

  async register(
    dto: RegisterDto,
    registrationToken: string,
  ): Promise<AuthResponse> {
    const payload = jwtService.verifyRegistrationToken(registrationToken);

    const mobileNumber = payload.sub;

    const exists = await userRepository.existsByPhone(mobileNumber);

    if (exists) {
      throw new ApiError(409, "User already exists.");
    }

    const user = await userRepository.create({
      ...dto,
      mobileNumber,
      isPhoneVerified: true,
    });

    const accessToken = jwtService.generateAccessToken({
      sub: user.id,
      accountType: user.accountType,
      purpose: JWT_PURPOSE.ACCESS,
    });

    const refreshToken = jwtService.generateRefreshToken({
      sub: user.id,
      purpose: JWT_PURPOSE.REFRESH,
    });

    return {
      user: mapAuthUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { mobileNumber, otp } = loginDto;

    // Find user including password
    const user = await userRepository.findByPhone(mobileNumber);

    if (!user) {
      throw new ApiError(401, "Invalid mobile number or otp.");
    }

    const isVerified = await otpService.verifyOtp(mobileNumber, otp);

    if (!isVerified) {
      throw new ApiError(400, AUTH_MESSAGES.OTP_INVALID);
    }

    // Defensive check
    if (!user.isPhoneVerified) {
      throw new ApiError(403, "Phone number is not verified.");
    }

    // Account status
    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    if (user.status === USER_STATUS.BLOCKED) {
      throw new ApiError(403, "Your account has been blocked.");
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Generate tokens
    const { accessToken, refreshToken } = jwtService.generateAuthTokens({
      userId: user._id.toString(),
      accountType: user.accountType,
    });

    return {
      user: mapAuthUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async me(userId: string) {
    const user = await userRepository.findByIdWithMobileNumber(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const sellerProfile = await sellerRepository.findByUserId(userId);

    let locationWithIds: LocationWithIds | null = null;

    if (user?.location) {
      const existingState = await locationRepository.findStateByName(
        user.location.state,
      );

      const existingDistrict =
        await locationRepository.findDistrictByNameAndStateId(
          user.location.district,
          existingState!._id,
        );
      const existingVillage =
        await locationRepository.findVillageByNameAndDistrictId(
          user.location.village,
          existingDistrict!._id,
        );
      locationWithIds = {
        village: {
          id: existingVillage!._id.toString(),
          name: existingVillage!.name,
        },
        state: {
          id: existingState!._id.toString(),
          name: existingState!.name,
        },
        district: {
          id: existingDistrict!._id.toString(),
          name: existingDistrict!.name,
        },
        pincode: user.location.pincode,
      };
    }

    return mapUserProfileResponse(user, sellerProfile, locationWithIds);
  }

  async refreshToken(refreshToken?: string): Promise<string> {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required.");
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);

    if (payload.purpose !== JWT_PURPOSE.REFRESH) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (!user.isPhoneVerified) {
      throw new ApiError(403, "Phone number is not verified.");
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    if (user.status === USER_STATUS.BLOCKED) {
      throw new ApiError(403, "Your account has been blocked.");
    }

    return jwtService.generateAccessToken({
      sub: user._id.toString(),
      accountType: user.accountType,
      purpose: JWT_PURPOSE.ACCESS,
    });
  }

  async loginWithMsg91({ msgAccessToken }: { msgAccessToken: string }) {
    const result = await verifyMsg91AccessToken(msgAccessToken);

    const identifier = result.message;

    if (!identifier || typeof identifier !== "string") {
      throw new ApiError(401, "Unable to identify verified mobile number.");
    }

    const mobileNumber = normalizeIndianMobile(identifier);

    const user = await User.findOne({
      mobileNumber,
    });

    if (!user) {
      throw new ApiError(404, "User doesn't exist.");
    }

    if (!user.isPhoneVerified) {
      throw new ApiError(403, "Phone number is not verified.");
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    if (user.status === USER_STATUS.BLOCKED) {
      throw new ApiError(403, "Your account has been blocked.");
    }

    await userRepository.updateLastLogin(user._id);

    const { accessToken, refreshToken } = jwtService.generateAuthTokens({
      userId: user._id.toString(),
      accountType: user.accountType,
    });

    return {
      user: mapAuthUserResponse(user),
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();

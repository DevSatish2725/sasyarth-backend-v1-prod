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
  RegisterDto,
  VerifyOtpDto,
} from "./auth.types";
import { userRepository } from "../users/user.repository";
import { USER_STATUS } from "../users/user.constants";
import { locationRepository } from "../location/location.repository";
import { logger } from "../../config/logger";
import { sellerRepository } from "../seller/seller.repository";
import { mapAuthUserResponse, mapUserProfileResponse } from "./auth.mapper";

class AuthService {
  async registerSendOtp(mobileNumber: string) {
    const user = await userRepository.findByPhone(mobileNumber);
    if (user) {
      throw new ApiError(
        409,
        "User already exist with provided mobile number.",
      );
    }
    const hasActiveOtp = otpService.hasActiveOtp(mobileNumber);
    if (hasActiveOtp) {
      throw new ApiError(429, AUTH_MESSAGES.OTP_ALREADY_SENT);
    }

    const otp = await otpService.generateOtp(mobileNumber);
    //TODO: Send the OTP to the user's mobile number via SMS or other means.
    try {
      await smsService.sendOtp(mobileNumber, otp);
    } catch {
      // SMS delivery failed.
      // Remove the generated OTP so the user can request a new one.
      otpService.deleteOtp(mobileNumber);
      throw new ApiError(500, AUTH_MESSAGES.OTP_SEND_FAILED);
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
    const hasActiveOtp = otpService.hasActiveOtp(mobileNumber);
    if (hasActiveOtp) {
      throw new ApiError(429, AUTH_MESSAGES.OTP_ALREADY_SENT);
    }

    const otp = await otpService.generateOtp(mobileNumber);
    //TODO: Send the OTP to the user's mobile number via SMS or other means.
    try {
      await smsService.sendOtp(mobileNumber, otp);
    } catch {
      // SMS delivery failed.
      // Remove the generated OTP so the user can request a new one.
      otpService.deleteOtp(mobileNumber);
      throw new ApiError(500, AUTH_MESSAGES.OTP_SEND_FAILED);
    }
  }

  async verifyOtp(
    dto: VerifyOtpDto,
  ): Promise<{ mobileNumber: string; registrationToken: string | null }> {
    const { mobileNumber, otp } = dto;

    const isVerified = await otpService.verifyOtp(mobileNumber, otp);

    if (!isVerified) {
      throw new ApiError(400, AUTH_MESSAGES.OTP_INVALID);
    }

    const exists = await userRepository.existsByPhone(mobileNumber);

    if (exists) {
      return {
        mobileNumber,
        registrationToken: null,
      };
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
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const sellerProfile = await sellerRepository.findByUserId(userId);

    return mapUserProfileResponse(user, sellerProfile);
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
}

export const authService = new AuthService();

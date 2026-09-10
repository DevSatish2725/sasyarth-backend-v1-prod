/**
 * ============================================================
 * File: jwt.service.ts
 *
 * Purpose:
 * Centralizes JWT generation and verification.
 *
 * Responsibilities:
 * - Generate tokens.
 * - Verify tokens.
 * - Decode payloads.
 *
 * This service should NEVER:
 * - Query the database.
 * - Perform authentication logic.
 * ============================================================
 */

import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { JWT_EXPIRY, JWT_PURPOSE } from "./jwt.constants";

import type {
  AccessTokenPayload,
  PasswordResetTokenPayload,
  RefreshTokenPayload,
  RegistrationTokenPayload,
} from "./jwt.types";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";
import { UserAccountType } from "../../modules/users/user.types";

class JwtService {
  /**
   * Common method responsible for creating JWTs.
   */
  private signToken(
    payload: object,
    secret: Secret,
    expiresIn: NonNullable<SignOptions["expiresIn"]>,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  /**
   * Creates a short-lived access token.
   */
  generateAccessToken(payload: AccessTokenPayload): string {
    return this.signToken(payload, env.JWT_ACCESS_SECRET, JWT_EXPIRY.ACCESS);
  }

  /**
   * Creates a long-lived refresh token.
   */
  generateRefreshToken(payload: RefreshTokenPayload): string {
    return this.signToken(payload, env.JWT_REFRESH_SECRET, JWT_EXPIRY.REFRESH);
  }
  generateRegistrationToken(payload: RegistrationTokenPayload): string {
    return this.signToken(
      payload,
      env.JWT_REGISTRATION_SECRET,
      JWT_EXPIRY.REGISTRATION,
    );
  }

  generateAuthTokens({
    userId,
    accountType,
  }: {
    userId: string;
    accountType: UserAccountType;
  }) {
    const accessToken = this.generateAccessToken({
      sub: userId,
      accountType: accountType,
      purpose: JWT_PURPOSE.ACCESS,
    });

    const refreshToken = this.generateRefreshToken({
      sub: userId,
      purpose: JWT_PURPOSE.REFRESH,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verifies a registration token.
   *
   * Business Rules:
   * 1. Token must be valid.
   * 2. Token must not be expired.
   * 3. Token must be a REGISTRATION token.
   *
   * Returns:
   * Decoded registration token payload.
   */
  verifyRegistrationToken(token: string): RegistrationTokenPayload {
    try {
      const payload = jwt.verify(
        token,
        env.JWT_REGISTRATION_SECRET,
      ) as RegistrationTokenPayload;

      if (payload.purpose !== JWT_PURPOSE.REGISTRATION) {
        throw new ApiError(401, "Invalid registration token.");
      }

      return payload;
    } catch {
      throw new ApiError(401, "Invalid or expired registration token.");
    }
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }

  generatePasswordResetToken(payload: PasswordResetTokenPayload): string {
    return this.signToken(
      payload,
      env.JWT_PASSWORD_RESET_SECRET,
      JWT_EXPIRY.RESET,
    );
  }

  verifyPasswordResetToken(token: string): PasswordResetTokenPayload {
    return jwt.verify(
      token,
      env.JWT_PASSWORD_RESET_SECRET,
    ) as PasswordResetTokenPayload;
  }
}

export const jwtService = new JwtService();

/**
 * ============================================================
 * File: jwt.types.ts
 *
 * Purpose:
 * Defines JWT payload types used throughout the application.
 * ============================================================
 */

import { UserAccountType } from "../../modules/users/user.types.js";
import { JWT_PURPOSE } from "./jwt.constants.js";

export interface RegistrationTokenPayload {
  sub: string; // mobile number
  purpose: typeof JWT_PURPOSE.REGISTRATION;
}

export interface AccessTokenPayload {
  sub: string; // userId
  accountType: UserAccountType;
  purpose: typeof JWT_PURPOSE.ACCESS;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  purpose: typeof JWT_PURPOSE.REFRESH;
}

export interface PasswordResetTokenPayload {
  sub: string;
  purpose: typeof JWT_PURPOSE.PASSWORD_RESET;
}

/**
 * ============================================================
 * File: jwt.constants.ts
 *
 * Purpose:
 * Stores JWT-related constants.
 *
 * Responsibilities:
 * - Token purposes.
 * - Token expiry durations.
 *
 * Never store secret keys here.
 * Secrets belong in environment variables.
 * ============================================================
 */

import type { SignOptions } from "jsonwebtoken";

export const JWT_PURPOSE = {
  REGISTRATION: "REGISTRATION",
  ACCESS: "ACCESS",
  REFRESH: "REFRESH",
  PASSWORD_RESET: "RESET",
} as const;

export const JWT_EXPIRY: Record<
  "REGISTRATION" | "ACCESS" | "REFRESH" | "RESET",
  NonNullable<SignOptions["expiresIn"]>
> = {
  REGISTRATION: "10m",
  ACCESS: "15m",
  REFRESH: "7d",
  RESET: "10m",
};

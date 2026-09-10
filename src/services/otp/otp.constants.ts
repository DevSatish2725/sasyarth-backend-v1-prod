/**
 * ============================================================
 * File: otp.constants.ts
 *
 * Purpose:
 * Stores all OTP-related configuration values.
 *
 * Business Context:
 * Keeping OTP rules centralized makes them easy to
 * update as GreenBridge evolves.
 * ============================================================
 */

export const OTP_CONSTANTS = {
  LENGTH: 6,

  EXPIRY_IN_MINUTES: 5,

  MAX_ATTEMPTS: 5,

  RESEND_COOLDOWN_IN_SECONDS: 60,
  BCRYPT_ROUNDS: 10
} as const;
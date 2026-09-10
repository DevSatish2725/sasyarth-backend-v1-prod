/**
 * ============================================================
 * File: auth.constants.ts
 *
 * Purpose:
 * Stores reusable constants used throughout the Auth module.
 *
 * Why:
 * Avoids magic numbers and hardcoded values, making
 * the codebase easier to maintain and update.
 * ============================================================
 */

export const AUTH_CONSTANTS = {
  PHONE: {
    LENGTH: 10,
  },

  OTP: {
    LENGTH: 6,
  },
} as const;

export const AUTH_MESSAGES = {
  OTP_ALREADY_SENT: "Please wait before requesting another OTP.",
  OTP_SENT: "OTP sent successfully.",
  OTP_SEND_FAILED: "Failed to send OTP. Please try again.",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_INVALID: "Invalid or expired OTP."
};

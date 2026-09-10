/**
 * ============================================================
 * File: user.constants.ts
 *
 * Purpose:
 * Stores business constants related to users.
 *
 * Business Context:
 * Every authenticated person is a USER by default.
 * ADMIN accounts are managed internally.
 * ============================================================
 */

export const USER_ACCOUNT_TYPES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
} as const;

export const SUPPORTED_LANGUAGES = {
  ENGLISH: "en",
  HINDI: "hi",
} as const;

export const USER_MESSAGES = {
  PROFILE_FETCHED: "User profile fetched successfully.",
  PROFILE_UPDATED: "User profile updted successfully."
}
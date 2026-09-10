/**
 * ============================================================
 * File: auth.validation.ts
 *
 * Purpose:
 * Defines validation schemas for Auth APIs.
 *
 * Business Context:
 * Ensures only valid data reaches controllers and
 * services, preventing invalid requests from entering
 * the business layer.
 * ============================================================
 */

import { z } from "zod";

/**
 * Send OTP Schema
 */

export const sendOtpSchema = {
  body: z.object({
    mobileNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  }),
};

export const verifyOtpSchema = {
  body: z.object({
    mobileNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

    otp: z
      .string()
      .trim()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
  }),
};

export const registerSchema = {
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),
  }),
};

export const loginSchema = {
  body: z.object({
    mobileNumber: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number."),

    otp: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32, "Password cannot exceed 32 characters."),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    resetToken: z.string().min(1),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32),
  }),
};

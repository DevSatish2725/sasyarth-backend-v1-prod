/**
 * ============================================================
 * File: auth.routes.ts
 *
 * Purpose:
 * Defines all authentication-related API endpoints.
 *
 * Responsibilities:
 * - Register authentication routes.
 * - Attach request validation middleware.
 * - Connect routes to controllers.
 *
 * This file should NEVER:
 * - Contain business logic.
 * - Access the database.
 * - Generate or verify OTP.
 * ============================================================
 */

import { Router } from "express";

import { authController } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  registerSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "./auth.validation";
import { requireAuth } from "../../middlewares/requireAuth.js";

const authRouter = Router();

/**
 * ============================================================
 * Send OTP
 *
 * POST /api/v1/auth/send-otp
 *
 * Workflow:
 * Request
 *   ↓
 * Zod Validation
 *   ↓
 * Auth Controller
 *   ↓
 * Auth Service
 *   ↓
 * OTP Service
 *   ↓
 * SMS Service
 * ============================================================
 */
authRouter.post(
  "/register/send-otp",
  validateRequest(sendOtpSchema),
  authController.registerSendOtp,
);

authRouter.post(
  "/login/send-otp",
  validateRequest(sendOtpSchema),
  authController.loginSendOtp,
);

authRouter.post(
  "/msg91/verify/register",
  authController.verifyMsg91Otp,
);

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest(verifyOtpSchema),
  authController.login,
);

authRouter.get("/me", requireAuth, authController.me);

authRouter.post("/refresh-token", authController.refreshToken);

authRouter.post("/logout", authController.logout);

authRouter.post("/msg91/verify/login", authController.loginWithMsg91);

export default authRouter;

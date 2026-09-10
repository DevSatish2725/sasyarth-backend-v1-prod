/**
 * AuthController
 *
 * Purpose:
 * Handles incoming HTTP requests for authentication.
 *
 * Responsibilities:
 * - Receive validated requests.
 * - Call AuthService.
 * - Return HTTP responses.
 * - Pass errors to the global error handler.
 *
 * This controller should NEVER contain business logic.
 */

import { authService } from "./auth.service.js";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { extractBearerToken } from "../../utils/extractBearerToken.js";
import { env } from "../../config/env";
import { USER_MESSAGES } from "../users/user.constants.js";

class AuthController {
  registerSendOtp = catchAsync(async (req, res) => {
    await authService.registerSendOtp(req.body.mobileNumber);
    const options = {
      statusCode: 200,
      //   success: true,
      message: AUTH_MESSAGES.OTP_SENT,
      //   data: result,
    };
    sendResponse(res, options);
  });

   loginSendOtp = catchAsync(async (req, res) => {
    await authService.loginSendOtp(req.body.mobileNumber);
    const options = {
      statusCode: 200,
      //   success: true,
      message: AUTH_MESSAGES.OTP_SENT,
      //   data: result,
    };
    sendResponse(res, options);
  });

  verifyOtp = catchAsync(async (req, res) => {
    const data = await authService.verifyOtp(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: AUTH_MESSAGES.OTP_VERIFIED,
      data,
    });
  });

  register = catchAsync(async (req, res) => {
    const registrationToken = extractBearerToken(req.headers.authorization);

    const result = await authService.register(req.body, registrationToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 201,
      message: "Registration successful.",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  login = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Login successful.",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  me = catchAsync(async (req, res) => {
    const user = await authService.me(req.user!.userId);

    sendResponse(res, {
      statusCode: 200,
      message: USER_MESSAGES.PROFILE_FETCHED,
      data: user,
    });
  });

  refreshToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await authService.refreshToken(refreshToken);

    sendResponse(res, {
      statusCode: 200,
      message: "Access token refreshed successfully.",
      data: {
        accessToken,
      },
    });
  });

  logout = catchAsync(async (_req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Logged out successfully.",
    });
  });
}

export const authController = new AuthController();

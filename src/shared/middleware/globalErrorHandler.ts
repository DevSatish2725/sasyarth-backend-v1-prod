/**
 * ============================================================
 * File: globalErrorHandler.ts
 *
 * Purpose:
 * Centralized Express error handling middleware.
 *
 * Business Context:
 * Every error in GreenBridge should return a consistent
 * response structure so frontend applications can handle
 * failures predictably.
 *
 * Responsibility:
 * Converts application errors into standardized HTTP
 * responses.
 * ============================================================
 */

import { ErrorRequestHandler } from "express";
import { ApiError } from "../../utils/ApiError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  /**
   * Default values for unexpected errors.
   */
  let statusCode = 500;
  let message = "Something went wrong.";

  /**
   * Business errors explicitly thrown by the application.
   */
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  /**
   * Unexpected JavaScript or third-party errors.
   */
  else if (error instanceof Error) {
    message = error.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

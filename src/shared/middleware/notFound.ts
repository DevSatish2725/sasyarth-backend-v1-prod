/**
 * ============================================================
 * File: notFound.ts
 *
 * Purpose:
 * Handles requests for routes that do not exist.
 *
 * Business Context:
 * Every unknown route should return the same standardized
 * error response as every other API error.
 *
 * Responsibility:
 * Create a 404 ApiError and forward it to the global
 * error handler.
 * ============================================================
 */

import { RequestHandler } from "express";
import { ApiError } from "../../utils/ApiError";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
};

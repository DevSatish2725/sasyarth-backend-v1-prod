/**
 * ============================================================
 * File: health.controller.ts
 *
 * Purpose:
 * Handles HTTP requests for the Health module.
 *
 * Business Context:
 * Receives the health check request, calls the service,
 * and sends a standardized API response.
 *
 * Responsibility:
 * - Receive HTTP request
 * - Call service
 * - Return standardized response
 * ============================================================
 */

import { RequestHandler } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { getHealthStatus } from "./health.service.js";

export const getHealth: RequestHandler = (_req, res) => {
  const healthStatus = getHealthStatus();

  sendResponse(res, {
    statusCode: 200,
    message: "Health status retrieved successfully.",
    data: healthStatus,
  });
};
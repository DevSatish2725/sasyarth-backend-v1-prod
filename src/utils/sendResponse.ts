/**
 * ============================================================
 * File: sendResponse.ts
 *
 * Purpose:
 * Sends a standardized success response to the client.
 *
 * Business Context:
 * Every GreenBridge API should return a consistent response
 * structure so frontend and mobile applications can consume
 * APIs predictably.
 *
 * Why:
 * Prevents inconsistent response formats across controllers.
 * ============================================================
 */

import type { Response } from "express";


interface SendResponseOptions<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: unknown;
}

const sendResponse = <T>(res: Response, options: SendResponseOptions<T>) => {
  const { statusCode, message, data, meta } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export { sendResponse };

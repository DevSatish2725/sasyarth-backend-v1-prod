/**
 * ============================================================
 * Module      : Configuration
 * File        : logger.ts
 *
 * Purpose:
 * Creates a centralized application logger.
 *
 * Business Context:
 * Every important action in GreenBridge should be traceable.
 *
 * Why:
 * Helps diagnose production issues, monitor system health,
 * and understand user activity.
 * ============================================================
 */

import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

/**
 * ============================================================
 * File: health.routes.ts
 *
 * Purpose:
 * Registers all HTTP routes for the Health module.
 *
 * Business Context:
 * Exposes endpoints that allow clients, monitoring systems,
 * and load balancers to verify the application's health.
 *
 * Responsibility:
 * Map HTTP endpoints to their respective controllers.
 * No business logic should exist here.
 * ============================================================
 */

import { Router } from "express";
import { getHealth } from "./health.controller";

const router = Router();

/**
 * Health Check
 *
 * GET /health
 */
router.get("/", getHealth);

export default router;

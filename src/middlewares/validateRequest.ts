/**
 * ============================================================
 * File: validateRequest.ts
 *
 * Purpose:
 * Generic middleware for validating different parts of an
 * incoming HTTP request.
 *
 * Business Context:
 * Every request entering GreenBridge must be validated
 * before reaching controllers and services.
 *
 * Business Rule:
 * Invalid input must never enter the business layer.
 *
 * Why:
 * One reusable middleware can validate request body,
 * params and query across the entire application.
 * ============================================================
 */

import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validateRequest =
  (schemas: ValidationSchemas) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        if (!req.body) {
          throw new ApiError(400, "Request body is required.");
        }
        req.body = await schemas.body?.parseAsync(req.body);
      }

      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(
          req.params,
        )) as typeof req.params;
      }

      if (schemas.query) {
        // req.query = (await schemas.query?.parseAsync(
        //   req.query,
        // )) as typeof req.query;
        await schemas.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(400, error.issues[0]?.message ?? "Validation failed."),
        );
      }

      next(error);
    }
  };

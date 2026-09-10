/**
 * ============================================================
 * File: catchAsync.ts
 *
 * Purpose:
 * Eliminates repetitive try...catch blocks from asynchronous
 * Express controllers.
 *
 * Business Context:
 * Every asynchronous controller may throw errors.
 * Instead of handling errors individually, all errors are
 * forwarded to Express's global error handling middleware.
 *
 * Responsibility:
 * Wrap asynchronous route handlers and automatically forward
 * rejected promises to the next middleware.
 * ============================================================
 */

import { NextFunction, Request, Response, RequestHandler } from "express";

/**
 * Wraps an asynchronous Express route handler.
 *
 * Any error thrown inside the controller is automatically
 * forwarded to Express's global error handler.
 */

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * ============================================================
 * File: extractBearerToken.ts
 *
 * Purpose:
 * Extracts the JWT from an Authorization header.
 *
 * Business Context:
 * Protected endpoints receive JWTs using the
 * Authorization: Bearer <token> header.
 *
 * Responsibility:
 * Validate the header format and return only the token.
 * ============================================================
 */

import { ApiError } from "./ApiError";

export const extractBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw new ApiError(401, "Authorization header is required.");
  }

  const parts = authorizationHeader.trim().split(/\s+/);

  if (parts.length !== 2) {
    throw new ApiError(401, "Invalid authorization header.");
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Invalid authorization header.");
  }

  return token;
};

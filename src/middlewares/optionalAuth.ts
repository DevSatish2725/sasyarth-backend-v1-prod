import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";
import { jwtService } from "../services/jwt/jwt.service";
import { JWT_PURPOSE } from "../services/jwt/jwt.constants";

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  // Public request — no authentication provided.
  if (!authorization) {
    return next();
  }

  if (!authorization.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required."));
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return next(new ApiError(401, "Authentication required."));
  }

  try {
    const payload = jwtService.verifyAccessToken(token);

    if (payload.purpose !== JWT_PURPOSE.ACCESS) {
      return next(new ApiError(401, "Invalid access token."));
    }

    req.user = {
      userId: payload.sub,
      accountType: payload.accountType,
    };

    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token."));
  }
};

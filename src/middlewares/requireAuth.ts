import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";
import { jwtService } from "../services/jwt/jwt.service";
import { JWT_PURPOSE } from "../services/jwt/jwt.constants";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required."));
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return next(new ApiError(401, "Authentication required."));
  }

  try {
    const payload = jwtService.verifyAccessToken(token);

    if (payload.purpose !== JWT_PURPOSE.ACCESS) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = {
      userId: payload.sub,
      accountType: payload.accountType,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token."));
  }
};

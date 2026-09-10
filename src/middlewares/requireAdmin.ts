import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { USER_ACCOUNT_TYPES } from "../modules/users/user.constants";
import { userRepository } from "../modules/users/user.repository";

export const requireAdmin: RequestHandler = async (req, _res, next) => {
  const user = await userRepository.findById(req.user!.userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  if (user.accountType !== USER_ACCOUNT_TYPES.ADMIN) {
    throw new ApiError(403, "Admin access required.");
  }

  next();
};

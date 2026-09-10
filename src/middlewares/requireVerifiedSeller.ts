import { RequestHandler } from "express";
import { sellerRepository } from "../modules/seller/seller.repository";
import {
  SELLER_STATUS,
  SELLER_VERIFICATION_STATUS,
} from "../modules/seller/seller.constants";
import { ApiError } from "../utils/ApiError";

export const requireVerifiedSeller: RequestHandler = async (
  req,
  _res,
  next,
) => {
  try {
    const seller = await sellerRepository.findByUserId(req.user!.userId);

    if (!seller) {
      throw new ApiError(403, "You are not a verified seller.");
    }

    if (seller.verificationStatus !== SELLER_VERIFICATION_STATUS.VERIFIED) {
      throw new ApiError(
        403,
        "Seller verification is required to perform this action.",
      );
    }

    if (seller.sellerStatus !== SELLER_STATUS.ACTIVE) {
      throw new ApiError(403, "Seller account is blocked.");
    }
    req.sellerId = seller!._id.toString()
    next();
  } catch (error) {
    next(error);
  }
};

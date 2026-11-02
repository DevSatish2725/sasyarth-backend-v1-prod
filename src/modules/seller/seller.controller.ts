import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SELLER_MESSAGES } from "./seller.constants";
import { sellerService } from "./seller.service";
import {
  GetSellerListingParams,
  SellerVerificationStatus,
} from "./seller.types";
class SellerController {
  apply = catchAsync(async (req, res) => {
    const seller = await sellerService.apply(req.user!.userId, req.body);
    sendResponse(res, {
      statusCode: 201,
      message: SELLER_MESSAGES.REQUEST_RECEIVED,
      data: seller,
    });
  });

  me = catchAsync(async (req, res) => {
    const seller = await sellerService.me(req.user!.userId);
    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.SELLER_PROFILE_FETCHED,
      data: seller,
    });
  });

  reApply = catchAsync(async (req, res) => {
    const seller = await sellerService.reApply(req.user!.userId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.REQUEST_RECEIVED,
      data: seller,
    });
  });

  adminList = catchAsync(async (req, res) => {
    const sellers = await sellerService.adminList(
      req.query.status as SellerVerificationStatus,
    );

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.SELLERS_FETCHED,
      data: sellers,
    });
  });

  adminDetails = catchAsync(async (req, res) => {
    const { sellerId } = req.params;
    const seller = await sellerService.adminDetails(sellerId as string);

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.SELLER_PROFILE_FETCHED,
      data: seller,
    });
  });

  approve = catchAsync(async (req, res) => {
    const { sellerId } = req.params;

    if (!sellerId || Array.isArray(sellerId)) {
      throw new ApiError(400, "Invalid seller ID.");
    }

    const seller = await sellerService.approve(sellerId, req.user!.userId);

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.REQUEST_VERIFIED,
      data: seller,
    });
  });

  reject = catchAsync(async (req, res) => {
    const { sellerId } = req.params;

    if (!sellerId || Array.isArray(sellerId)) {
      throw new ApiError(400, "Invalid seller ID.");
    }

    const seller = await sellerService.reject(
      sellerId,
      req.user!.userId,
      req.body.rejectionReason,
    );

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.REQUEST_REJECTED,
      data: seller,
    });
  });

  block = catchAsync(async (req, res) => {
    const { sellerId } = req.params;

    if (!sellerId || Array.isArray(sellerId)) {
      throw new ApiError(400, "Invalid seller ID.");
    }

    const seller = await sellerService.block(
      sellerId,
      req.user!.userId,
      req.body.blockReason,
    );

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.SELLER_PROFILE_BLOCKED,
      data: seller,
    });
  });

  unblock = catchAsync(async (req, res) => {
    const { sellerId } = req.params;

    if (!sellerId || Array.isArray(sellerId)) {
      throw new ApiError(400, "Invalid seller ID.");
    }

    const seller = await sellerService.unblock(sellerId, req.user!.userId);

    sendResponse(res, {
      statusCode: 200,
      message: SELLER_MESSAGES.SELLER_PROFILE_UNBLOCKED,
      data: seller,
    });
  });

  getSellerListing = catchAsync(async (req, res) => {
    const {
      latitude,
      longitude,
      radiusInKm,
      limit,
      stateId,
      districtId,
      blockId,
      villageId,
      maujaId,
      habitationId,
      vegetableIds,
      cursor,
    } = req.query;

    const params: GetSellerListingParams = {
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      stateId: stateId ? stateId as string : undefined,
      districtId: districtId ? districtId as string : undefined,
      blockId: blockId ? blockId as string : undefined,
      villageId: villageId ? villageId as string : undefined,
      maujaId: maujaId ? maujaId as string : undefined,
      habitationId: habitationId ? habitationId as string : undefined,
      userId: req.user?.userId ?? "",
      cursor: typeof cursor === "string" ? cursor : undefined,
    };

    if (typeof radiusInKm === "string") {
      const parsedRadius = Number(radiusInKm);

      if (!Number.isFinite(parsedRadius) || parsedRadius <= 0) {
        throw new ApiError(400, "Invalid radiusInKm");
      }

      params.radiusInKm = parsedRadius;
    }

    if (typeof limit === "string") {
      const parsedLimit = Number(limit);

      if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        throw new ApiError(400, "Invalid limit");
      }

      params.limit = parsedLimit;
    }

    if (typeof vegetableIds === "string") {
      params.vegetableIds = vegetableIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
    }

    const result = await sellerService.getSellerListing(params);

    sendResponse(res, {
      statusCode: 200,

      message: "Seller listing fetched successfully",

      data: result.data,

      meta: {
        matchingMode: result.matchingMode,
        nextCursor: result.nextCursor,
      },
    });
  });

  getCallSellerDetails = catchAsync(async (req, res) => {
    const { sellerId } = req.params;
    const buyerId = req.user?.userId;
    const result = await sellerService.getCallSellerDetails(
      sellerId as string,
      buyerId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      data: result,
      message: "Seller call details fetched successfully.",
    });
  });
}

export const sellerController = new SellerController();

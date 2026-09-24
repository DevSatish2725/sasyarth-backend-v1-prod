import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { sellerRatingService } from "./sellerRating.service";

class SellerRatingController {
  create = catchAsync(async (req, res) => {
    const rating = await sellerRatingService.create({
      buyerUserId: req.user!.userId,
      sellerProfileId: req.params.sellerId as string,
      rating: req.body.rating,
      tags: req.body.tags,
    });

    sendResponse(res, {
      statusCode: 201,
      message: "Seller rated successfully.",
      data: rating,
    });
  });

  getMySellerRatingStatus = catchAsync(async (req, res) => {
    const result = await sellerRatingService.getMySellerRatingStatus({
      buyerUserId: req.user!.userId,
      sellerProfileId: req.params.sellerId as string,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Seller rating status fetched successfully.",
      data: result,
    });
  });

  getRatingSummary = catchAsync(async (req, res) => {
    const result = await sellerRatingService.getSellerRatingSummary(
      req.params.sellerId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Seller rating summary fetched successfully.",
      data: result,
    });
  });

  updateSellerRating = catchAsync(async (req, res) => {
    const result = await sellerRatingService.updateSellerRating({
      buyerUserId: req.user!.userId,
      sellerProfileId: req.params.sellerId as string,
      payload: req.body,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Seller rating updated successfully.",
      data: result,
    });
  });
}

export const sellerRatingController = new SellerRatingController();

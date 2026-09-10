import { Types } from "mongoose";
import { catchAsync } from "../../../utils/catchAsync";
import { sellerReviewService } from "./seller-review.service";
import { CreateSellerReviewDto } from "./seller-reviewDto";
import { sendResponse } from "../../../utils/sendResponse";

class SellerReviewController {
  createSellerReview = catchAsync(async (req, res) => {
    const buyerId = new Types.ObjectId(req.user!.userId);

    const review = await sellerReviewService.createSellerReview(
      buyerId,
      req.params.orderId as string,
      req.body as CreateSellerReviewDto,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Seller review submitted successfully.",
      data: review,
    });
  });

  getSellerReviews = catchAsync(async (req, res) => {
    const sellerProfileId = new Types.ObjectId(
      req.params.sellerProfileId as string,
    );

    const result = await sellerReviewService.getSellerReviews(sellerProfileId);

    sendResponse(res, {
      statusCode: 200,
      message: "Seller reviews fetched successfully.",
      data: result,
    });
  });
}

export const sellerReviewController = new SellerReviewController();

import { Types } from "mongoose";
import { CreateSellerReviewDto } from "./seller-reviewDto";
import { ApiError } from "../../../utils/ApiError";
import { sellerReviewRepository } from "./seller-reviewRepository";
import { mapSellerReviewListItem } from "./seller-review.mapper";

class SellerReviewService {
  async createSellerReview(
    buyerId: Types.ObjectId,
    orderId: string,
    payload: CreateSellerReviewDto,
  ) {

    // const existingReview = await sellerReviewRepository.findByOrderId(
    //   order._id,
    // );

    // if (existingReview) {
    //   throw new ApiError(409, "This order has already been reviewed.");
    // }

    // return sellerReviewRepository.create({
    //   orderId: order._id,

    //   buyerId,

    //   sellerProfileId: order.sellerProfileId,

    //   rating: payload.rating,

    //   ...(payload.comment !== undefined
    //     ? {
    //         comment: payload.comment,
    //       }
    //     : {}),
    // });
  }

  async getSellerReputation(sellerProfileId: Types.ObjectId) {
    const [ratingStats] = await Promise.all([
      sellerReviewRepository.getSellerRatingStats(sellerProfileId),

      // orderRepository.countCompletedOrders(sellerProfileId),
    ]);

    return {
      ...ratingStats,
      // completedDeals,
    };
  }

  async getSellerReviews(sellerProfileId: Types.ObjectId) {
  //   const [ratingStats, completedDeals, reviews] = await Promise.all([
  //     sellerReviewRepository.getSellerRatingStats(sellerProfileId),

  //     orderRepository.countCompletedOrders(sellerProfileId),

  //     sellerReviewRepository.findSellerReviews(sellerProfileId, 20),
  //   ]);

  //   return {
  //     averageRating: ratingStats.averageRating,

  //     totalRatings: ratingStats.totalRatings,

  //     completedDeals,

  //     reviews: reviews.map(mapSellerReviewListItem),
  //   };
  }
}

export const sellerReviewService = new SellerReviewService();

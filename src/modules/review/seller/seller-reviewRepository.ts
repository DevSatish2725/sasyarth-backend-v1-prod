import { Types } from "mongoose";
import { SellerReview } from "./seller-review.model";
import {
  CreateSellerReviewPayload,
  SellerReviewListEntity,
} from "./seller-review.types";

class SellerReviewRepository {
  async create(payload: CreateSellerReviewPayload) {
    return SellerReview.create(payload);
  }

  async findByOrderId(orderId: Types.ObjectId) {
    return SellerReview.findOne({
      orderId,
    }).lean();
  }

  async getSellerRatingStats(sellerProfileId: Types.ObjectId) {
    const [stats] = await SellerReview.aggregate([
      {
        $match: {
          sellerProfileId,
        },
      },
      {
        $group: {
          _id: "$sellerProfileId",

          averageRating: {
            $avg: "$rating",
          },

          totalRatings: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,

          averageRating: {
            $round: ["$averageRating", 1],
          },

          totalRatings: 1,
        },
      },
    ]);

    return (
      stats ?? {
        averageRating: 0,
        totalRatings: 0,
      }
    );
  }

  async findSellerReviews(
    sellerProfileId: Types.ObjectId,
    limit = 20,
  ): Promise<SellerReviewListEntity[]> {
    return SellerReview.aggregate<SellerReviewListEntity>([
      {
        $match: {
          sellerProfileId,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $limit: limit,
      },

      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyerUser",
        },
      },

      {
        $unwind: "$buyerUser",
      },

      {
        $project: {
          _id: 1,

          buyer: {
            fullName: "$buyerUser.fullName",
          },

          rating: 1,
          comment: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

export const sellerReviewRepository = new SellerReviewRepository();

import { Types } from "mongoose";
import { SellerRatingModel } from "./sellerRating.model";
import {
  RatingSummaryAggregation,
  SellerRatingTag,
  UpdateSellerRatingPayload,
} from "./sellerRating.types";

class SellerRatingRepository {
  findByBuyerAndSeller({
    buyerUserId,
    sellerProfileId,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
  }) {
    return SellerRatingModel.findOne({
      buyerUserId,
      sellerProfileId,
    })
      .select("_id rating tags createdAt updatedAt")
      .lean();
  }

  create(data: {
    buyerUserId: string;
    sellerProfileId: string;
    rating: number;
    tags: SellerRatingTag[];
    contactInteractionId: string;
  }) {
    return SellerRatingModel.create(data);
  }

  async getRatingSummary(
    sellerProfileId: string,
  ): Promise<RatingSummaryAggregation | null> {
    const [result] =
      await SellerRatingModel.aggregate<RatingSummaryAggregation>([
        {
          $match: {
            sellerProfileId: new Types.ObjectId(sellerProfileId),
          },
        },

        {
          $facet: {
            ratingSummary: [
              {
                $group: {
                  _id: null,

                  averageRating: {
                    $avg: "$rating",
                  },

                  ratingCount: {
                    $sum: 1,
                  },
                },
              },

              {
                $project: {
                  _id: 0,
                  averageRating: 1,
                  ratingCount: 1,
                },
              },
            ],

            tagSummary: [
              {
                $unwind: "$tags",
              },

              {
                $group: {
                  _id: "$tags",
                  count: {
                    $sum: 1,
                  },
                },
              },

              {
                $sort: {
                  count: -1,
                },
              },
            ],
          },
        },
      ]);

    return result ?? null;
  }

  async updateByBuyerAndSeller({
    buyerUserId,
    sellerProfileId,
    payload,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
    payload: UpdateSellerRatingPayload;
  }) {
    return SellerRatingModel.findOneAndUpdate(
      {
        buyerUserId,
        sellerProfileId,
      },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();
  }
}

export const sellerRatingRepository = new SellerRatingRepository();

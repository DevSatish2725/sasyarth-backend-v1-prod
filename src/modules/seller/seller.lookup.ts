import { PipelineStage, Types } from "mongoose";

import { SELLER_STATUS, SELLER_VERIFICATION_STATUS } from "./seller.constants";

import { STATUS } from "../inventory/dailyInventory/dailyInventory.constants";

/**
 * Common seller lookup.
 *
 * User._id
 *      ↓
 * Seller.userId
 */
class SellerLookup {
  getSellerLookupStages(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: "sellers",

          localField: "_id",
          foreignField: "userId",

          as: "seller",
        },
      },

      {
        $unwind: "$seller",
      },

      {
        $match: {
          "seller.sellerStatus": SELLER_STATUS.ACTIVE,

          "seller.verificationStatus": SELLER_VERIFICATION_STATUS.VERIFIED,
        },
      },
    ];
  }

  /**
   * Today's PUBLISHED inventory lookup.
   *
   * Seller._id
   *       ↓
   * DailyInventory.sellerProfileId
   */
  getInventoryLookupStages(
    today: Date,
    vegetableIds?: Types.ObjectId[],
  ): PipelineStage[] {
    return [
      {
        $lookup: {
          from: "dailyinventories",

          let: {
            sellerProfileId: "$seller._id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$sellerProfileId", "$$sellerProfileId"],
                    },
                    {
                      $eq: ["$inventoryDate", today],
                    },
                    {
                      $eq: ["$status", STATUS.PUBLISHED],
                    },
                  ],
                },
              },
            },

            /**
             * All currently available items.
             */
            {
              $set: {
                availableItems: {
                  $filter: {
                    input: "$items",
                    as: "item",

                    cond: {
                      $gt: ["$$item.availableQty", 0],
                    },
                  },
                },
              },
            },

            /**
             * Inventory must contain at least
             * one available item.
             */
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: "$availableItems",
                    },
                    0,
                  ],
                },
              },
            },

            /**
             * If buyer searched vegetables:
             * ANY selected vegetable can match.
             *
             * Otherwise matchingItems contains
             * every available item.
             */
            {
              $set: {
                matchingItems: vegetableIds?.length
                  ? {
                      $filter: {
                        input: "$availableItems",
                        as: "item",

                        cond: {
                          $in: ["$$item.vegetableId", vegetableIds],
                        },
                      },
                    }
                  : "$availableItems",
              },
            },

            /**
             * Seller qualifies only if at least
             * one matching item exists.
             */
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: "$matchingItems",
                    },
                    0,
                  ],
                },
              },
            },
          ],

          as: "dailyInventory",
        },
      },

      {
        $unwind: "$dailyInventory",
      },
    ];
  }

  /**
   * Populate vegetable names for available items.
   */
  getVegetableLookupStages(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: "vegetables",

          localField: "dailyInventory.availableItems.vegetableId",

          foreignField: "_id",

          as: "vegetables",
        },
      },
    ];
  }

  getSavedSellerLookupStages = (buyerId?: Types.ObjectId): PipelineStage[] => {
    // Guest user
    if (!buyerId) {
      return [
        {
          $set: {
            isSaved: false,
          },
        },
      ];
    }

    // Logged-in user
    return [
      {
        $lookup: {
          from: "savedsellers",

          let: {
            sellerProfileId: "$seller._id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$sellerProfileId", "$$sellerProfileId"],
                    },
                    {
                      $eq: ["$buyerId", buyerId],
                    },
                  ],
                },
              },
            },

            {
              $limit: 1,
            },
          ],

          as: "savedSellerMatch",
        },
      },

      {
        $set: {
          isSaved: {
            $gt: [
              {
                $size: "$savedSellerMatch",
              },
              0,
            ],
          },
        },
      },

      {
        $unset: "savedSellerMatch",
      },
    ];
  };

  getSellerReputationLookupStages = (): PipelineStage[] => {
    return [
      {
        $lookup: {
          from: "sellerreviews",

          let: {
            sellerProfileId: "$seller._id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$sellerProfileId", "$$sellerProfileId"],
                },
              },
            },

            {
              $group: {
                _id: null,

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
          ],

          as: "ratingStats",
        },
      },

      {
        $lookup: {
          from: "orders",

          let: {
            sellerProfileId: "$seller._id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$sellerProfileId", "$$sellerProfileId"],
                    },
//TODO: Uncomment this condition when order status is implemented
                    // {
                    //   $eq: ["$status", ORDER_STATUS.COMPLETED],
                    // },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],

          as: "completedOrderStats",
        },
      },

      {
        $set: {
          reputation: {
            averageRating: {
              $ifNull: [
                {
                  $arrayElemAt: ["$ratingStats.averageRating", 0],
                },
                0,
              ],
            },

            totalRatings: {
              $ifNull: [
                {
                  $arrayElemAt: ["$ratingStats.totalRatings", 0],
                },
                0,
              ],
            },

            completedDeals: {
              $ifNull: [
                {
                  $arrayElemAt: ["$completedOrderStats.count", 0],
                },
                0,
              ],
            },
          },
        },
      },

      {
        $unset: ["ratingStats", "completedOrderStats"],
      },
    ];
  };
}

export const sellerLookup = new SellerLookup();

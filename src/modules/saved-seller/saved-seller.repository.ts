import { PipelineStage, Types } from "mongoose";
import { SavedSeller } from "./saved-seller.model";
import {
  SavedSellerBuyerEntity,
  SavedSellerListEntity,
} from "./saved-seller.types";

class SavedSellerRepository {
  async create(buyerId: Types.ObjectId, sellerProfileId: Types.ObjectId) {
    return SavedSeller.create({
      buyerId,
      sellerProfileId,
    });
  }

  async findOne(buyerId: Types.ObjectId, sellerProfileId: Types.ObjectId) {
    return SavedSeller.findOne({
      buyerId,
      sellerProfileId,
    }).lean();
  }

  async deleteOne(buyerId: Types.ObjectId, sellerProfileId: Types.ObjectId) {
    return SavedSeller.findOneAndDelete({
      buyerId,
      sellerProfileId,
    });
  }

  // async findBuyerSavedSellers(
  //   buyerId: Types.ObjectId,
  // ): Promise<SavedSellerListEntity[]> {
  //   return SavedSeller.aggregate<SavedSellerListEntity>([
  //     {
  //       $match: {
  //         buyerId,
  //       },
  //     },

  //     {
  //       $sort: {
  //         createdAt: -1,
  //       },
  //     },

  //     {
  //       $lookup: {
  //         from: "sellers",
  //         localField: "sellerProfileId",
  //         foreignField: "_id",
  //         as: "sellerProfile",
  //       },
  //     },

  //     {
  //       $unwind: "$sellerProfile",
  //     },

  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "sellerProfile.userId",
  //         foreignField: "_id",
  //         as: "sellerUser",
  //       },
  //     },

  //     {
  //       $unwind: "$sellerUser",
  //     },

  //     {
  //       $project: {
  //         _id: 1,
  //         sellerProfileId: 1,

  //         savedAt: "$createdAt",

  //         seller: {
  //           fullName: "$sellerUser.fullName",

  //           location: "$sellerUser.location",
  //         },
  //       },
  //     },
  //   ]);
  // }

  async findBuyerSavedSellers(
    buyerId: Types.ObjectId,
    today: Date,
  ): Promise<SavedSellerListEntity[]> {
    return SavedSeller.aggregate<SavedSellerListEntity>([
      // --------------------------------------------------
      // 1. Get only this buyer's saved sellers
      // --------------------------------------------------
      {
        $match: {
          buyerId,
        },
      },

      // --------------------------------------------------
      // 2. Latest saved seller first
      // --------------------------------------------------
      {
        $sort: {
          createdAt: -1,
        },
      },

      // --------------------------------------------------
      // 3. Get SellerProfile
      //
      // Don't filter VERIFIED/ACTIVE here.
      // We need unavailable sellers too.
      // --------------------------------------------------
      {
        $lookup: {
          from: "sellers",
          localField: "sellerProfileId",
          foreignField: "_id",
          as: "sellerProfile",
        },
      },

      {
        $unwind: {
          path: "$sellerProfile",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      // 4. Get seller's User
      // --------------------------------------------------
      {
        $lookup: {
          from: "users",
          localField: "sellerProfile.userId",
          foreignField: "_id",
          as: "sellerUser",
        },
      },

      {
        $unwind: {
          path: "$sellerUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // --------------------------------------------------
      // 5. Find today's PUBLISHED inventory that contains
      //    at least one item with availableQty > 0
      // --------------------------------------------------
      {
        $lookup: {
          from: "dailyinventories",

          let: {
            sellerProfileId: "$sellerProfileId",
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
                      $eq: ["$status", "PUBLISHED"],
                    },
                  ],
                },
              },
            },

            // Remove unavailable items.
            {
              $set: {
                items: {
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

            // If no sellable item remains,
            // inventory doesn't qualify as available.
            {
              $match: {
                "items.0": {
                  $exists: true,
                },
              },
            },

            // We only need vegetable IDs from inventory.
            {
              $project: {
                _id: 0,
                vegetableIds: "$items.vegetableId",
              },
            },
          ],

          as: "todayInventory",
        },
      },

      // --------------------------------------------------
      // 6. Extract vegetable IDs
      //
      // There can only be one inventory per seller/day
      // because of your unique compound index.
      // --------------------------------------------------
      {
        $set: {
          availableVegetableIds: {
            $ifNull: [
              {
                $arrayElemAt: ["$todayInventory.vegetableIds", 0],
              },
              [],
            ],
          },
        },
      },

      // --------------------------------------------------
      // 7. Get vegetable names
      // --------------------------------------------------
      {
        $lookup: {
          from: "vegetables",
          localField: "availableVegetableIds",
          foreignField: "_id",
          as: "vegetableDetails",
        },
      },

      // --------------------------------------------------
      // 8. Rating summary
      // --------------------------------------------------
      {
        $lookup: {
          from: "sellerratings",

          let: {
            sellerProfileId: "$sellerProfileId",
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

                ratingCount: {
                  $sum: 1,
                },
              },
            },
          ],

          as: "ratingSummary",
        },
      },

      // --------------------------------------------------
      // 9. Determine availability
      //
      // Priority:
      //
      // invalid seller
      //       ↓
      // SELLER_UNAVAILABLE
      //
      // valid seller + no inventory
      //       ↓
      // NO_INVENTORY
      //
      // valid seller + sellable inventory
      //       ↓
      // AVAILABLE
      // --------------------------------------------------
      {
        $set: {
          availabilityStatus: {
            $switch: {
              branches: [
                {
                  case: {
                    $or: [
                      // Seller profile missing
                      {
                        $eq: [
                          {
                            $type: "$sellerProfile._id",
                          },
                          "missing",
                        ],
                      },

                      // Seller's User missing
                      {
                        $eq: [
                          {
                            $type: "$sellerUser._id",
                          },
                          "missing",
                        ],
                      },

                      // Seller not verified
                      {
                        $ne: ["$sellerProfile.verificationStatus", "VERIFIED"],
                      },

                      // Seller isn't active
                      {
                        $ne: ["$sellerProfile.sellerStatus", "ACTIVE"],
                      },
                    ],
                  },

                  then: "SELLER_UNAVAILABLE",
                },

                // Active + verified,
                // but nothing sellable today
                {
                  case: {
                    $eq: [
                      {
                        $size: "$todayInventory",
                      },
                      0,
                    ],
                  },

                  then: "NO_INVENTORY",
                },
              ],

              default: "AVAILABLE",
            },
          },
        },
      },

      // --------------------------------------------------
      // 10. Normalize rating summary
      // --------------------------------------------------
      {
        $set: {
          ratingSummary: {
            $ifNull: [
              {
                $arrayElemAt: ["$ratingSummary", 0],
              },

              {
                averageRating: 0,
                ratingCount: 0,
              },
            ],
          },
        },
      },

      // --------------------------------------------------
      // 11. Build lightweight vegetable DTO
      //
      // IMPORTANT:
      // Don't expose vegetables when seller itself
      // is unavailable.
      // --------------------------------------------------
      {
        $set: {
          availableVegetables: {
            $cond: [
              {
                $eq: ["$availabilityStatus", "AVAILABLE"],
              },

              {
                $map: {
                  input: "$vegetableDetails",
                  as: "vegetable",

                  in: {
                    id: "$$vegetable._id",
                    name: "$$vegetable.name",
                  },
                },
              },

              [],
            ],
          },
        },
      },

      // --------------------------------------------------
      // 12. Final API DTO
      // --------------------------------------------------
      {
        $project: {
          _id: 1,

          sellerProfileId: 1,

          savedAt: "$createdAt",

          availabilityStatus: 1,

          seller: {
            fullName: "$sellerUser.fullName",

            location: "$sellerUser.location",

            verificationStatus: "$sellerProfile.verificationStatus",

            averageRating: {
              $round: ["$ratingSummary.averageRating", 1],
            },

            ratingCount: "$ratingSummary.ratingCount",
          },

          availableVegetables: 1,
        },
      },
    ]).exec();
  }

  async findBuyerIdsBySellerProfileId(
    sellerProfileId: Types.ObjectId,
  ): Promise<SavedSellerBuyerEntity[]> {
    return SavedSeller.find({
      sellerProfileId,
    })
      .select({
        buyerId: 1,
        _id: 0,
      })
      .lean();
  }
}

export const savedSellerRepository = new SavedSellerRepository();

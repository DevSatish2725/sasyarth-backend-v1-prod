import { PipelineStage, Types } from "mongoose";
import { sellerLookup } from "./seller.lookup";
import {
  BroadSellerPipelineParams,
  GeoSellerPipelineParams,
  PublicSellerPipelineParams,
  VillageSellerPipelineParams,
} from "./seller.types";
import { ApiError } from "../../utils/ApiError";

/**
 * Public seller listing.
 *
 * No buyer location is required.
 */

class SellerPipeline {
  // getPublicSellerPipeline({
  //   normalizedVegetableIds,
  //   today,
  //   limit,
  //   userId,
  // }: {
  //   normalizedVegetableIds?: Types.ObjectId[];
  //   today: Date;
  //   limit: number;
  //   userId: string;
  // }): PipelineStage[] {
  //   return [
  //     /**
  //      * Don't filter by location.
  //      *
  //      * We also don't actually need accountType here
  //      * if Seller.userId is the source of truth.
  //      */
  //     ...sellerLookup.getSellerLookupStages(userId),

  //     ...sellerLookup.getSellerReputationLookupStages(),

  //     ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

  //     ...sellerLookup.getVegetableLookupStages(),

  //     ...sellerLookup.getSellerRatingLookupStages(),

  //     /**
  //      * General listing order.
  //      *
  //      * You can change this later to:
  //      *
  //      * seller rating
  //      * latest published
  //      * promoted sellers
  //      * etc.
  //      */
  //     {
  //       $sort: {
  //         "dailyInventory.updatedAt": -1,
  //         "seller._id": 1,
  //       },
  //     },

  //     {
  //       $limit: limit,
  //     },

  //     {
  //       $project: {
  //         _id: 0,

  //         userId: "$_id",

  //         sellerId: "$seller._id",

  //         fullName: 1,

  //         location: 1,

  //         reputation: 1,

  //         businessType: "$seller.businessType",

  //         vegetables: {
  //           $let: {
  //             vars: {
  //               itemsWithMatch: {
  //                 $map: {
  //                   input: "$dailyInventory.availableItems",
  //                   as: "item",

  //                   in: {
  //                     vegetableId: "$$item.vegetableId",
  //                     sellerPrice: "$$item.sellerPrice",
  //                     unit: "$$item.unit",
  //                     availableQty: "$$item.availableQty",

  //                     isMatched: normalizedVegetableIds?.length
  //                       ? {
  //                           $in: ["$$item.vegetableId", normalizedVegetableIds],
  //                         }
  //                       : false,
  //                   },
  //                 },
  //               },
  //             },

  //             in: {
  //               $map: {
  //                 input: {
  //                   $sortArray: {
  //                     input: "$$itemsWithMatch",
  //                     sortBy: {
  //                       isMatched: -1,
  //                     },
  //                   },
  //                 },

  //                 as: "item",

  //                 in: {
  //                   $let: {
  //                     vars: {
  //                       vegetable: {
  //                         $arrayElemAt: [
  //                           {
  //                             $filter: {
  //                               input: "$vegetables",
  //                               as: "vegetable",
  //                               cond: {
  //                                 $eq: [
  //                                   "$$vegetable._id",
  //                                   "$$item.vegetableId",
  //                                 ],
  //                               },
  //                             },
  //                           },
  //                           0,
  //                         ],
  //                       },
  //                     },

  //                     in: {
  //                       id: "$$item.vegetableId",
  //                       name: "$$vegetable.name",
  //                       imageUrl: "$$vegetable.imageUrl",

  //                       sellerPrice: "$$item.sellerPrice",
  //                       unit: "$$item.unit",
  //                       availableQty: "$$item.availableQty",

  //                       isMatched: "$$item.isMatched",
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },

  //         averageRating: {
  //           $round: [
  //             {
  //               $ifNull: [
  //                 {
  //                   $arrayElemAt: ["$ratingSummary.averageRating", 0],
  //                 },
  //                 0,
  //               ],
  //             },
  //             1,
  //           ],
  //         },
  //         ratingCount: {
  //           $ifNull: [
  //             {
  //               $arrayElemAt: ["$ratingSummary.ratingCount", 0],
  //             },
  //             0,
  //           ],
  //         },
  //       },
  //     },
  //   ];
  // }

  getPublicSellerPipeline({
    normalizedVegetableIds,
    today,
    limit,
    userId,
    cursor,
  }: PublicSellerPipelineParams): PipelineStage[] {
    const cursorStages: PipelineStage[] = cursor
      ? [
          {
            $match: {
              $or: [
                {
                  "dailyInventory.updatedAt": {
                    $lt: cursor.updatedAt,
                  },
                },
                {
                  "dailyInventory.updatedAt": cursor.updatedAt,
                  "seller._id": {
                    $gt: cursor.sellerId,
                  },
                },
              ],
            },
          },
        ]
      : [];

    return [
      /**
       * Seller lookup.
       *
       * No location filter is applied for public listing.
       */
      ...sellerLookup.getSellerLookupStages(userId),

      /**
       * Seller reputation.
       */
      ...sellerLookup.getSellerReputationLookupStages(),

      /**
       * Today's published inventory.
       *
       * This must be before cursor matching because
       * cursor depends on dailyInventory.updatedAt.
       */
      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      /**
       * Vegetable master lookup.
       */
      ...sellerLookup.getVegetableLookupStages(),

      /**
       * Seller rating summary.
       */
      ...sellerLookup.getSellerRatingLookupStages(),

      /**
       * Cursor must come after seller + inventory lookups
       * because it depends on:
       *
       * dailyInventory.updatedAt
       * seller._id
       */
      ...cursorStages,

      /**
       * Stable cursor-compatible ordering.
       *
       * First:
       * newest inventory
       *
       * Tie breaker:
       * seller id ascending
       */
      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      /**
       * Fetch one extra row.
       *
       * If frontend asks for 10,
       * pipeline returns at most 11.
       *
       * Service layer can then determine
       * whether nextCursor should exist.
       */
      {
        $limit: limit + 1,
      },

      {
        $project: {
          _id: 0,

          userId: "$_id",

          sellerId: "$seller._id",

          fullName: 1,

          location: 1,

          reputation: 1,

          businessType: "$seller.businessType",

          /**
           * Needed by service layer to generate
           * the next compound cursor.
           *
           * You can remove this before sending
           * seller data to frontend.
           */
          inventoryUpdatedAt: "$dailyInventory.updatedAt",

          vegetables: {
            $let: {
              vars: {
                itemsWithMatch: {
                  $map: {
                    input: "$dailyInventory.availableItems",

                    as: "item",

                    in: {
                      vegetableId: "$$item.vegetableId",

                      sellerPrice: "$$item.sellerPrice",

                      unit: "$$item.unit",

                      availableQty: "$$item.availableQty",

                      isMatched: normalizedVegetableIds?.length
                        ? {
                            $in: ["$$item.vegetableId", normalizedVegetableIds],
                          }
                        : false,
                    },
                  },
                },
              },

              in: {
                $map: {
                  input: {
                    $sortArray: {
                      input: "$$itemsWithMatch",

                      sortBy: {
                        isMatched: -1,
                      },
                    },
                  },

                  as: "item",

                  in: {
                    $let: {
                      vars: {
                        vegetable: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$vegetables",

                                as: "vegetable",

                                cond: {
                                  $eq: [
                                    "$$vegetable._id",
                                    "$$item.vegetableId",
                                  ],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },

                      in: {
                        id: "$$item.vegetableId",

                        name: "$$vegetable.name",

                        displayNames: "$$vegetable.displayNames",

                        imageUrl: "$$vegetable.imageUrl",

                        sellerPrice: "$$item.sellerPrice",

                        unit: "$$item.unit",

                        availableQty: "$$item.availableQty",

                        isMatched: "$$item.isMatched",
                      },
                    },
                  },
                },
              },
            },
          },

          averageRating: {
            $round: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: ["$ratingSummary.averageRating", 0],
                  },
                  0,
                ],
              },
              1,
            ],
          },

          ratingCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$ratingSummary.ratingCount", 0],
              },
              0,
            ],
          },
        },
      },
    ];
  }
  /**
   * Village-based seller matching.
   *
   * Used when buyer is logged in but
   * hasn't provided GPS coordinates.
   */
  // getVillageSellerPipeline({
  //   state,
  //   district,
  //   village,
  //   normalizedVegetableIds,
  //   today,
  //   limit,
  //   userId,
  // }: {
  //   state: string;
  //   district: string;
  //   village: string;
  //   normalizedVegetableIds?: Types.ObjectId[];
  //   today: Date;
  //   limit: number;
  //   userId: string;
  // }): PipelineStage[] {
  //   return [
  //     /**
  //      * Same village only.
  //      */
  //     {
  //       $match: {
  //         "location.state": state,
  //         "location.district": district,
  //         "location.village": village,
  //       },
  //     },

  //     ...sellerLookup.getSellerLookupStages(userId),

  //     ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

  //     ...sellerLookup.getVegetableLookupStages(),

  //     ...sellerLookup.getSellerRatingLookupStages(),

  //     {
  //       $sort: {
  //         "dailyInventory.updatedAt": -1,
  //         "seller._id": 1,
  //       },
  //     },

  //     {
  //       $limit: limit,
  //     },

  //     {
  //       $project: {
  //         _id: 0,

  //         userId: "$_id",

  //         sellerId: "$seller._id",

  //         fullName: 1,

  //         location: 1,

  //         businessType: "$seller.businessType",

  //         matchType: {
  //           $literal: "VILLAGE",
  //         },

  //         vegetables: {
  //           $let: {
  //             vars: {
  //               itemsWithMatch: {
  //                 $map: {
  //                   input: "$dailyInventory.availableItems",
  //                   as: "item",

  //                   in: {
  //                     vegetableId: "$$item.vegetableId",
  //                     sellerPrice: "$$item.sellerPrice",
  //                     unit: "$$item.unit",
  //                     availableQty: "$$item.availableQty",

  //                     isMatched: normalizedVegetableIds?.length
  //                       ? {
  //                           $in: ["$$item.vegetableId", normalizedVegetableIds],
  //                         }
  //                       : false,
  //                   },
  //                 },
  //               },
  //             },

  //             in: {
  //               $map: {
  //                 input: {
  //                   $sortArray: {
  //                     input: "$$itemsWithMatch",
  //                     sortBy: {
  //                       isMatched: -1,
  //                     },
  //                   },
  //                 },

  //                 as: "item",

  //                 in: {
  //                   $let: {
  //                     vars: {
  //                       vegetable: {
  //                         $arrayElemAt: [
  //                           {
  //                             $filter: {
  //                               input: "$vegetables",
  //                               as: "vegetable",
  //                               cond: {
  //                                 $eq: [
  //                                   "$$vegetable._id",
  //                                   "$$item.vegetableId",
  //                                 ],
  //                               },
  //                             },
  //                           },
  //                           0,
  //                         ],
  //                       },
  //                     },

  //                     in: {
  //                       id: "$$item.vegetableId",
  //                       name: "$$vegetable.name",
  //                       imageUrl: "$$vegetable.imageUrl",

  //                       sellerPrice: "$$item.sellerPrice",
  //                       unit: "$$item.unit",
  //                       availableQty: "$$item.availableQty",

  //                       isMatched: "$$item.isMatched",
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },

  //         averageRating: {
  //           $round: [
  //             {
  //               $ifNull: [
  //                 {
  //                   $arrayElemAt: ["$ratingSummary.averageRating", 0],
  //                 },
  //                 0,
  //               ],
  //             },
  //             1,
  //           ],
  //         },
  //         ratingCount: {
  //           $ifNull: [
  //             {
  //               $arrayElemAt: ["$ratingSummary.ratingCount", 0],
  //             },
  //             0,
  //           ],
  //         },
  //       },
  //     },
  //   ];
  // }

  getVillageSellerPipeline({
    state,
    district,
    village,
    normalizedVegetableIds,
    today,
    limit,
    userId,
    cursor,
  }: VillageSellerPipelineParams): PipelineStage[] {
    /**
     * Cursor filtering has to happen after
     * seller + inventory lookups because we
     * depend on:
     *
     * dailyInventory.updatedAt
     * seller._id
     */
    const cursorStages: PipelineStage[] = cursor
      ? [
          {
            $match: {
              $or: [
                /**
                 * Since updatedAt is sorted DESC,
                 * next page must contain older
                 * inventory timestamps.
                 */
                {
                  "dailyInventory.updatedAt": {
                    $lt: cursor.updatedAt,
                  },
                },

                /**
                 * If multiple sellers have the same
                 * inventory timestamp, use seller._id
                 * as the stable ASC tie-breaker.
                 */
                {
                  "dailyInventory.updatedAt": cursor.updatedAt,

                  "seller._id": {
                    $gt: cursor.sellerId,
                  },
                },
              ],
            },
          },
        ]
      : [];

    return [
      /**
       * =====================================================
       * SAME VILLAGE ONLY
       * =====================================================
       */
      {
        $match: {
          "location.state": state,
          "location.district": district,
          "location.village": village,
        },
      },

      /**
       * Seller profile.
       */
      ...sellerLookup.getSellerLookupStages(userId),

      /**
       * Today's inventory.
       *
       * This must be before cursor matching because
       * cursor relies on dailyInventory.updatedAt.
       */
      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      /**
       * Vegetable master.
       */
      ...sellerLookup.getVegetableLookupStages(),

      /**
       * Rating summary.
       */
      ...sellerLookup.getSellerRatingLookupStages(),

      /**
       * Cursor filter.
       */
      ...cursorStages,

      /**
       * Stable sort for cursor pagination.
       */
      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      /**
       * Fetch one extra row.
       *
       * Example:
       * requested limit = 10
       * pipeline returns max 11
       *
       * Service layer can then determine whether
       * another page exists.
       */
      {
        $limit: limit + 1,
      },

      /**
       * =====================================================
       * FINAL RESPONSE SHAPE
       * =====================================================
       */
      {
        $project: {
          _id: 0,

          userId: "$_id",

          sellerId: "$seller._id",

          fullName: 1,

          location: 1,

          businessType: "$seller.businessType",

          matchType: {
            $literal: "VILLAGE",
          },

          /**
           * Internal pagination field.
           *
           * Keep this temporarily so the service can
           * generate nextCursor.
           */
          inventoryUpdatedAt: "$dailyInventory.updatedAt",

          vegetables: {
            $let: {
              vars: {
                itemsWithMatch: {
                  $map: {
                    input: "$dailyInventory.availableItems",

                    as: "item",

                    in: {
                      vegetableId: "$$item.vegetableId",

                      sellerPrice: "$$item.sellerPrice",

                      unit: "$$item.unit",

                      availableQty: "$$item.availableQty",

                      isMatched: normalizedVegetableIds?.length
                        ? {
                            $in: ["$$item.vegetableId", normalizedVegetableIds],
                          }
                        : false,
                    },
                  },
                },
              },

              in: {
                $map: {
                  /**
                   * Matching vegetables appear first.
                   */
                  input: {
                    $sortArray: {
                      input: "$$itemsWithMatch",

                      sortBy: {
                        isMatched: -1,
                      },
                    },
                  },

                  as: "item",

                  in: {
                    $let: {
                      vars: {
                        vegetable: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$vegetables",

                                as: "vegetable",

                                cond: {
                                  $eq: [
                                    "$$vegetable._id",
                                    "$$item.vegetableId",
                                  ],
                                },
                              },
                            },

                            0,
                          ],
                        },
                      },

                      in: {
                        id: "$$item.vegetableId",

                        name: "$$vegetable.name",

                        imageUrl: "$$vegetable.imageUrl",

                        sellerPrice: "$$item.sellerPrice",

                        unit: "$$item.unit",

                        availableQty: "$$item.availableQty",

                        isMatched: "$$item.isMatched",
                      },
                    },
                  },
                },
              },
            },
          },

          averageRating: {
            $round: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: ["$ratingSummary.averageRating", 0],
                  },
                  0,
                ],
              },
              1,
            ],
          },

          ratingCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$ratingSummary.ratingCount", 0],
              },
              0,
            ],
          },
        },
      },
    ];
  }

  /**
   * GPS based matching.
   *
   * Only users having geoLocation can participate
   * because $geoNear works on User.geoLocation.
   */
  // getGeoSellerPipeline({
  //   longitude,
  //   latitude,
  //   radiusInKm,
  //   normalizedVegetableIds,
  //   today,
  //   limit,
  //   userId,
  // }: {
  //   longitude: number;
  //   latitude: number;
  //   radiusInKm: number;
  //   normalizedVegetableIds?: Types.ObjectId[];
  //   today: Date;
  //   limit: number;
  //   userId: string;
  // }): PipelineStage[] {
  //   return [
  //     /**
  //      * MUST be the first stage.
  //      */
  //     {
  //       $geoNear: {
  //         near: {
  //           type: "Point",

  //           coordinates: [longitude, latitude],
  //         },

  //         key: "geoLocation",

  //         distanceField: "distanceInMeters",

  //         maxDistance: radiusInKm * 1000,

  //         spherical: true,
  //       },
  //     },

  //     ...sellerLookup.getSellerLookupStages(userId),

  //     ...sellerLookup.getSellerReputationLookupStages(),

  //     ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

  //     ...sellerLookup.getSavedSellerLookupStages(userId),

  //     ...sellerLookup.getVegetableLookupStages(),

  //     ...sellerLookup.getSellerRatingLookupStages(),

  //     {
  //       $set: {
  //         distanceInKm: {
  //           $divide: ["$distanceInMeters", 1000],
  //         },
  //       },
  //     },

  //     {
  //       $sort: {
  //         distanceInMeters: 1,
  //         "seller._id": 1,
  //       },
  //     },

  //     {
  //       $limit: limit,
  //     },

  //     {
  //       $project: {
  //         _id: 0,

  //         userId: "$_id",

  //         sellerId: "$seller._id",

  //         fullName: 1,

  //         location: 1,

  //         isSaved: 1,

  //         reputation: 1,

  //         businessType: "$seller.businessType",

  //         matchType: {
  //           $literal: "NEARBY",
  //         },

  //         distanceInKm: {
  //           /**
  //            * Optional:
  //            * round result for frontend.
  //            */
  //           $round: ["$distanceInKm", 2],
  //         },

  //         vegetables: {
  //           $let: {
  //             vars: {
  //               itemsWithMatch: {
  //                 $map: {
  //                   input: "$dailyInventory.availableItems",
  //                   as: "item",

  //                   in: {
  //                     vegetableId: "$$item.vegetableId",
  //                     sellerPrice: "$$item.sellerPrice",
  //                     unit: "$$item.unit",
  //                     availableQty: "$$item.availableQty",

  //                     isMatched: normalizedVegetableIds?.length
  //                       ? {
  //                           $in: ["$$item.vegetableId", normalizedVegetableIds],
  //                         }
  //                       : false,
  //                   },
  //                 },
  //               },
  //             },

  //             in: {
  //               $map: {
  //                 input: {
  //                   $sortArray: {
  //                     input: "$$itemsWithMatch",
  //                     sortBy: {
  //                       isMatched: -1,
  //                     },
  //                   },
  //                 },

  //                 as: "item",

  //                 in: {
  //                   $let: {
  //                     vars: {
  //                       vegetable: {
  //                         $arrayElemAt: [
  //                           {
  //                             $filter: {
  //                               input: "$vegetables",
  //                               as: "vegetable",
  //                               cond: {
  //                                 $eq: [
  //                                   "$$vegetable._id",
  //                                   "$$item.vegetableId",
  //                                 ],
  //                               },
  //                             },
  //                           },
  //                           0,
  //                         ],
  //                       },
  //                     },

  //                     in: {
  //                       id: "$$item.vegetableId",
  //                       name: "$$vegetable.name",
  //                       imageUrl: "$$vegetable.imageUrl",

  //                       sellerPrice: "$$item.sellerPrice",
  //                       unit: "$$item.unit",
  //                       availableQty: "$$item.availableQty",

  //                       isMatched: "$$item.isMatched",
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },

  //         averageRating: {
  //           $round: [
  //             {
  //               $ifNull: [
  //                 {
  //                   $arrayElemAt: ["$ratingSummary.averageRating", 0],
  //                 },
  //                 0,
  //               ],
  //             },
  //             1,
  //           ],
  //         },
  //         ratingCount: {
  //           $ifNull: [
  //             {
  //               $arrayElemAt: ["$ratingSummary.ratingCount", 0],
  //             },
  //             0,
  //           ],
  //         },
  //       },
  //     },
  //   ];
  // }

  getGeoSellerPipeline({
    longitude,
    latitude,
    radiusInKm,
    normalizedVegetableIds,
    today,
    limit,
    userId,
    cursor,
  }: GeoSellerPipelineParams): PipelineStage[] {
    /**
     * Cursor filtering must happen after:
     *
     * $geoNear
     * seller lookup
     *
     * because cursor depends on:
     *
     * distanceInMeters
     * seller._id
     */
    const cursorStages: PipelineStage[] = cursor
      ? [
          {
            $match: {
              $or: [
                {
                  distanceInMeters: {
                    $gt: cursor.distanceInMeters,
                  },
                },

                {
                  distanceInMeters: cursor.distanceInMeters,

                  "seller._id": {
                    $gt: cursor.sellerId,
                  },
                },
              ],
            },
          },
        ]
      : [];

    return [
      /**
       * =====================================================
       * GEO SEARCH
       * =====================================================
       *
       * $geoNear MUST be the first stage.
       */
      {
        $geoNear: {
          near: {
            type: "Point",

            coordinates: [longitude, latitude],
          },

          key: "geoLocation",

          distanceField: "distanceInMeters",

          maxDistance: radiusInKm * 1000,

          spherical: true,
        },
      },

      /**
       * Seller profile.
       */
      ...sellerLookup.getSellerLookupStages(userId),

      /**
       * Reputation.
       */
      ...sellerLookup.getSellerReputationLookupStages(),

      /**
       * Today's available inventory.
       */
      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      /**
       * Saved seller information.
       */
      ...sellerLookup.getSavedSellerLookupStages(userId),

      /**
       * Vegetable information.
       */
      ...sellerLookup.getVegetableLookupStages(),

      /**
       * Rating information.
       */
      ...sellerLookup.getSellerRatingLookupStages(),

      /**
       * =====================================================
       * CURSOR FILTER
       * =====================================================
       *
       * Sort order:
       *
       * distanceInMeters ASC
       * seller._id ASC
       *
       * Therefore next page must contain:
       *
       * distance > cursor.distance
       *
       * OR
       *
       * same distance AND seller._id > cursor.sellerId
       */
      ...cursorStages,

      /**
       * Convert distance for frontend display.
       */
      {
        $set: {
          distanceInKm: {
            $divide: ["$distanceInMeters", 1000],
          },
        },
      },

      /**
       * Stable cursor-compatible ordering.
       */
      {
        $sort: {
          distanceInMeters: 1,
          "seller._id": 1,
        },
      },

      /**
       * Fetch one extra record so service
       * can know whether another page exists.
       */
      {
        $limit: limit + 1,
      },

      /**
       * =====================================================
       * FINAL RESPONSE
       * =====================================================
       */
      {
        $project: {
          _id: 0,

          userId: "$_id",

          sellerId: "$seller._id",

          fullName: 1,

          location: 1,

          isSaved: 1,

          reputation: 1,

          businessType: "$seller.businessType",

          matchType: {
            $literal: "NEARBY",
          },

          /**
           * Keep raw distance temporarily
           * for cursor creation in service layer.
           */
          distanceInMeters: 1,

          /**
           * Rounded value for frontend.
           */
          distanceInKm: {
            $round: ["$distanceInKm", 2],
          },

          vegetables: {
            $let: {
              vars: {
                itemsWithMatch: {
                  $map: {
                    input: "$dailyInventory.availableItems",

                    as: "item",

                    in: {
                      vegetableId: "$$item.vegetableId",

                      sellerPrice: "$$item.sellerPrice",

                      unit: "$$item.unit",

                      availableQty: "$$item.availableQty",

                      isMatched: normalizedVegetableIds?.length
                        ? {
                            $in: ["$$item.vegetableId", normalizedVegetableIds],
                          }
                        : false,
                    },
                  },
                },
              },

              in: {
                $map: {
                  input: {
                    $sortArray: {
                      input: "$$itemsWithMatch",

                      sortBy: {
                        isMatched: -1,
                      },
                    },
                  },

                  as: "item",

                  in: {
                    $let: {
                      vars: {
                        vegetable: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$vegetables",

                                as: "vegetable",

                                cond: {
                                  $eq: [
                                    "$$vegetable._id",
                                    "$$item.vegetableId",
                                  ],
                                },
                              },
                            },

                            0,
                          ],
                        },
                      },

                      in: {
                        id: "$$item.vegetableId",

                        name: "$$vegetable.name",

                        imageUrl: "$$vegetable.imageUrl",

                        sellerPrice: "$$item.sellerPrice",

                        unit: "$$item.unit",

                        availableQty: "$$item.availableQty",

                        isMatched: "$$item.isMatched",
                      },
                    },
                  },
                },
              },
            },
          },

          averageRating: {
            $round: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: ["$ratingSummary.averageRating", 0],
                  },

                  0,
                ],
              },

              1,
            ],
          },

          ratingCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$ratingSummary.ratingCount", 0],
              },

              0,
            ],
          },
        },
      },
    ];
  }

  getBroadSellerPipeline({
    scope,
    state,
    district,
    village,
    normalizedVegetableIds,
    today,
    userId,
    limit,
    cursor,
  }: BroadSellerPipelineParams): PipelineStage[] {
    /**
     * =====================================================
     * LOCATION MATCH
     * =====================================================
     */
    const locationMatch: Record<string, unknown> = {
      "location.state": state,
    };

    /**
     * Village:
     * State + District + Village
     */
    if (scope === "village") {
      if (!district) {
        throw new ApiError(400, "District is required for village search");
      }

      if (!village) {
        throw new ApiError(400, "Village is required for village search");
      }

      locationMatch["location.district"] = district;

      locationMatch["location.village"] = village;
    }

    /**
     * District:
     * State + District
     */
    if (scope === "district") {
      if (!district) {
        throw new ApiError(
          400,
          "State and district are required for district search",
        );
      }

      locationMatch["location.district"] = district;
    }

    /**
     * State:
     * location.state is already enough.
     */

    /**
     * =====================================================
     * CURSOR MATCH
     * =====================================================
     *
     * Sort order:
     *
     * 1. inventory.updatedAt DESC
     * 2. seller._id ASC
     *
     * Therefore next page is:
     *
     * updatedAt < cursor.updatedAt
     *
     * OR
     *
     * updatedAt === cursor.updatedAt
     * AND seller._id > cursor.sellerId
     */
    const cursorStages: PipelineStage[] = cursor
      ? [
          {
            $match: {
              $or: [
                {
                  "dailyInventory.updatedAt": {
                    $lt: cursor.updatedAt,
                  },
                },

                {
                  "dailyInventory.updatedAt": cursor.updatedAt,

                  "seller._id": {
                    $gt: cursor.sellerId,
                  },
                },
              ],
            },
          },
        ]
      : [];

    /**
     * =====================================================
     * PIPELINE
     * =====================================================
     */
    return [
      /**
       * User's location exists directly
       * on User collection.
       */
      {
        $match: locationMatch,
      },

      /**
       * Seller profile.
       */
      ...sellerLookup.getSellerLookupStages(userId),

      /**
       * Seller reputation.
       */
      ...sellerLookup.getSellerReputationLookupStages(),

      /**
       * Today's inventory.
       *
       * This must happen BEFORE cursor matching
       * because cursor uses:
       *
       * dailyInventory.updatedAt
       */
      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      /**
       * Saved seller information.
       */
      ...sellerLookup.getSavedSellerLookupStages(userId),

      /**
       * Vegetable master information.
       */
      ...sellerLookup.getVegetableLookupStages(),

      /**
       * Seller rating summary.
       */
      ...sellerLookup.getSellerRatingLookupStages(),

      /**
       * IMPORTANT:
       *
       * Cursor match comes AFTER lookups because
       * seller._id and dailyInventory.updatedAt
       * need to exist first.
       */
      ...cursorStages,

      /**
       * Stable compound sort.
       */
      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      /**
       * Fetch one extra seller.
       *
       * Example:
       * requested limit = 10
       * aggregation returns max 11
       *
       * That allows the service to determine
       * whether another page exists.
       */
      {
        $limit: limit + 1,
      },

      /**
       * =====================================================
       * FINAL RESPONSE SHAPE
       * =====================================================
       */
      {
        $project: {
          _id: 0,

          userId: "$_id",

          sellerId: "$seller._id",

          fullName: 1,

          location: 1,

          isSaved: 1,

          reputation: 1,

          businessType: "$seller.businessType",

          matchType: {
            $literal: scope.toUpperCase(),
          },

          /**
           * Keep this internally so the
           * service can construct nextCursor.
           *
           * You can remove it before returning
           * data to frontend if you don't want
           * to expose it.
           */
          inventoryUpdatedAt: "$dailyInventory.updatedAt",

          /**
           * =================================================
           * VEGETABLES
           * =================================================
           */
          vegetables: {
            $let: {
              vars: {
                itemsWithMatch: {
                  $map: {
                    input: "$dailyInventory.availableItems",

                    as: "item",

                    in: {
                      vegetableId: "$$item.vegetableId",

                      sellerPrice: "$$item.sellerPrice",

                      unit: "$$item.unit",

                      availableQty: "$$item.availableQty",

                      isMatched: normalizedVegetableIds?.length
                        ? {
                            $in: ["$$item.vegetableId", normalizedVegetableIds],
                          }
                        : false,
                    },
                  },
                },
              },

              in: {
                $map: {
                  /**
                   * Matching searched vegetables
                   * appear first.
                   */
                  input: {
                    $sortArray: {
                      input: "$$itemsWithMatch",

                      sortBy: {
                        isMatched: -1,
                      },
                    },
                  },

                  as: "item",

                  in: {
                    $let: {
                      vars: {
                        vegetable: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$vegetables",

                                as: "vegetable",

                                cond: {
                                  $eq: [
                                    "$$vegetable._id",
                                    "$$item.vegetableId",
                                  ],
                                },
                              },
                            },

                            0,
                          ],
                        },
                      },

                      in: {
                        id: "$$item.vegetableId",

                        name: "$$vegetable.name",

                        imageUrl: "$$vegetable.imageUrl",

                        sellerPrice: "$$item.sellerPrice",

                        unit: "$$item.unit",

                        availableQty: "$$item.availableQty",

                        isMatched: "$$item.isMatched",
                      },
                    },
                  },
                },
              },
            },
          },

          /**
           * =================================================
           * RATING
           * =================================================
           */
          averageRating: {
            $round: [
              {
                $ifNull: [
                  {
                    $arrayElemAt: ["$ratingSummary.averageRating", 0],
                  },
                  0,
                ],
              },

              1,
            ],
          },

          ratingCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$ratingSummary.ratingCount", 0],
              },

              0,
            ],
          },
        },
      },
    ];
  }
}

export const sellerPipeline = new SellerPipeline();

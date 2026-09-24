import { PipelineStage, Types } from "mongoose";
import { sellerLookup } from "./seller.lookup";
import { BroadSellerPipelineParams } from "./seller.types";
import { ApiError } from "../../utils/ApiError";

/**
 * Public seller listing.
 *
 * No buyer location is required.
 */

class SellerPipeline {
  getPublicSellerPipeline({
    normalizedVegetableIds,
    today,
    limit,
    userId,
  }: {
    normalizedVegetableIds?: Types.ObjectId[];
    today: Date;
    limit: number;
    userId: string;
  }): PipelineStage[] {
    return [
      /**
       * Don't filter by location.
       *
       * We also don't actually need accountType here
       * if Seller.userId is the source of truth.
       */
      ...sellerLookup.getSellerLookupStages(userId),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getVegetableLookupStages(),

      ...sellerLookup.getSellerRatingLookupStages(),

      /**
       * General listing order.
       *
       * You can change this later to:
       *
       * seller rating
       * latest published
       * promoted sellers
       * etc.
       */
      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      {
        $limit: limit,
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

  /**
   * Village-based seller matching.
   *
   * Used when buyer is logged in but
   * hasn't provided GPS coordinates.
   */
  getVillageSellerPipeline({
    state,
    district,
    village,
    normalizedVegetableIds,
    today,
    limit,
    userId,
  }: {
    state: string;
    district: string;
    village: string;
    normalizedVegetableIds?: Types.ObjectId[];
    today: Date;
    limit: number;
    userId: string;
  }): PipelineStage[] {
    return [
      /**
       * Same village only.
       */
      {
        $match: {
          "location.state": state,
          "location.district": district,
          "location.village": village,
        },
      },

      ...sellerLookup.getSellerLookupStages(userId),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getVegetableLookupStages(),

      ...sellerLookup.getSellerRatingLookupStages(),

      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      {
        $limit: limit,
      },

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

  /**
   * GPS based matching.
   *
   * Only users having geoLocation can participate
   * because $geoNear works on User.geoLocation.
   */
  getGeoSellerPipeline({
    longitude,
    latitude,
    radiusInKm,
    normalizedVegetableIds,
    today,
    limit,
    userId,
  }: {
    longitude: number;
    latitude: number;
    radiusInKm: number;
    normalizedVegetableIds?: Types.ObjectId[];
    today: Date;
    limit: number;
    userId: string;
  }): PipelineStage[] {
    return [
      /**
       * MUST be the first stage.
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

      ...sellerLookup.getSellerLookupStages(userId),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getSavedSellerLookupStages(userId),

      ...sellerLookup.getVegetableLookupStages(),

      ...sellerLookup.getSellerRatingLookupStages(),

      {
        $set: {
          distanceInKm: {
            $divide: ["$distanceInMeters", 1000],
          },
        },
      },

      {
        $sort: {
          distanceInMeters: 1,
          "seller._id": 1,
        },
      },

      {
        $limit: limit,
      },

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

          distanceInKm: {
            /**
             * Optional:
             * round result for frontend.
             */
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
  }: BroadSellerPipelineParams): PipelineStage[] {
    const locationMatch: Record<string, string> = {
      "location.state": state,
    };

    /**
     * Village search should include state + district + village.
     *
     * Don't match only by village name because the same
     * village name may exist in multiple districts/states.
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
     * District search:
     *
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
     * State search needs only state.
     */

    return [
      {
        $match: locationMatch,
      },

      ...sellerLookup.getSellerLookupStages(userId),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getSavedSellerLookupStages(userId),

      ...sellerLookup.getVegetableLookupStages(),

      ...sellerLookup.getSellerRatingLookupStages(),

      {
        $sort: {
          "dailyInventory.updatedAt": -1,
          "seller._id": 1,
        },
      },

      {
        $limit: limit,
      },

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
}

export const sellerPipeline = new SellerPipeline();

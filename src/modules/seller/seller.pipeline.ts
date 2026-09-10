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
  }: {
    normalizedVegetableIds?: Types.ObjectId[];
    today: Date;
    limit: number;
  }): PipelineStage[] {
    return [
      /**
       * Don't filter by location.
       *
       * We also don't actually need accountType here
       * if Seller.userId is the source of truth.
       */
      ...sellerLookup.getSellerLookupStages(),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getVegetableLookupStages(),

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
            $map: {
              input: "$dailyInventory.matchingItems",
              as: "item",

              in: {
                id: "$$item.vegetableId",

                name: {
                  $let: {
                    vars: {
                      vegetable: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$vegetables",
                              as: "vegetable",
                              cond: {
                                $eq: ["$$vegetable._id", "$$item.vegetableId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },

                    in: "$$vegetable.name",
                  },
                },

                sellerPrice: "$$item.sellerPrice",
                unit: "$$item.unit",
                availableQty: "$$item.availableQty",
              },
            },
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
  }: {
    state: string;
    district: string;
    village: string;
    normalizedVegetableIds?: Types.ObjectId[];
    today: Date;
    limit: number;
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

      ...sellerLookup.getSellerLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getVegetableLookupStages(),

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
            $map: {
              input: "$dailyInventory.matchingItems",
              as: "item",

              in: {
                id: "$$item.vegetableId",

                name: {
                  $let: {
                    vars: {
                      vegetable: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$vegetables",
                              as: "vegetable",
                              cond: {
                                $eq: ["$$vegetable._id", "$$item.vegetableId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },

                    in: "$$vegetable.name",
                  },
                },

                sellerPrice: "$$item.sellerPrice",
                unit: "$$item.unit",
                availableQty: "$$item.availableQty",
              },
            },
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
    userId,
    today,
    limit,
  }: {
    longitude: number;
    latitude: number;
    radiusInKm: number;
    normalizedVegetableIds?: Types.ObjectId[];
    userId?: Types.ObjectId;
    today: Date;
    limit: number;
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

      ...sellerLookup.getSellerLookupStages(),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getSavedSellerLookupStages(userId),

      ...sellerLookup.getVegetableLookupStages(),

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
            $map: {
              input: "$dailyInventory.matchingItems",
              as: "item",

              in: {
                id: "$$item.vegetableId",

                name: {
                  $let: {
                    vars: {
                      vegetable: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$vegetables",
                              as: "vegetable",
                              cond: {
                                $eq: ["$$vegetable._id", "$$item.vegetableId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },

                    in: "$$vegetable.name",
                  },
                },

                sellerPrice: "$$item.sellerPrice",
                unit: "$$item.unit",
                availableQty: "$$item.availableQty",
              },
            },
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

      ...sellerLookup.getSellerLookupStages(),

      ...sellerLookup.getSellerReputationLookupStages(),

      ...sellerLookup.getInventoryLookupStages(today, normalizedVegetableIds),

      ...sellerLookup.getSavedSellerLookupStages(userId),

      ...sellerLookup.getVegetableLookupStages(),

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
            $map: {
              input: "$dailyInventory.matchingItems",
              as: "item",

              in: {
                id: "$$item.vegetableId",

                name: {
                  $let: {
                    vars: {
                      vegetable: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$vegetables",
                              as: "vegetable",
                              cond: {
                                $eq: ["$$vegetable._id", "$$item.vegetableId"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },

                    in: "$$vegetable.name",
                  },
                },

                sellerPrice: "$$item.sellerPrice",
                unit: "$$item.unit",
                availableQty: "$$item.availableQty",
              },
            },
          },
        },
      },
    ];
  }
}

export const sellerPipeline = new SellerPipeline();

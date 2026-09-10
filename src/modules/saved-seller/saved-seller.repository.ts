import { Types } from "mongoose";
import { SavedSeller } from "./saved-seller.model";
import { SavedSellerBuyerEntity, SavedSellerListEntity } from "./saved-seller.types";

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

  async findBuyerSavedSellers(
    buyerId: Types.ObjectId,
  ): Promise<SavedSellerListEntity[]> {
    return SavedSeller.aggregate<SavedSellerListEntity>([
      {
        $match: {
          buyerId,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $lookup: {
          from: "sellers",
          localField: "sellerProfileId",
          foreignField: "_id",
          as: "sellerProfile",
        },
      },

      {
        $unwind: "$sellerProfile",
      },

      {
        $lookup: {
          from: "users",
          localField: "sellerProfile.userId",
          foreignField: "_id",
          as: "sellerUser",
        },
      },

      {
        $unwind: "$sellerUser",
      },

      {
        $project: {
          _id: 1,
          sellerProfileId: 1,

          savedAt: "$createdAt",

          seller: {
            fullName: "$sellerUser.fullName",

            location: "$sellerUser.location",
          },
        },
      },
    ]);
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

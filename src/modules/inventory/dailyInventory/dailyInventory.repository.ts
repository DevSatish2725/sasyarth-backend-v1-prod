import { ClientSession, Types } from "mongoose";
import { DailyInventory } from "./dailyInventory.model";
import {
  CreateInventoryPayload,
  DailyInventoryDocument,
  PopulatedInventory,
  PopulatedVegetable,
} from "./dailyInventory.types";
import { STATUS } from "./dailyInventory.constants";

class DailyInventoryRepository {
  async findBySellerAndDate({
    sellerId,
    inventoryDate,
  }: {
    sellerId: string;
    inventoryDate: Date;
  }): Promise<PopulatedInventory | null> {
    const inventory = await DailyInventory.findOne({
      sellerProfileId: sellerId,
      inventoryDate,
    })
      .populate<{
        "items.vegetableId": PopulatedVegetable;
      }>({
        path: "items.vegetableId",
        select: "name",
      })
      .lean()
      .exec();

    return inventory as PopulatedInventory | null;
  }

  findFutureDraft(sellerId: string, fromDate: Date) {
    return DailyInventory.findOne({
      sellerProfileId: sellerId,
      status: "DRAFT",
      inventoryDate: fromDate,
    });
  }

  findById(id: string): Promise<DailyInventoryDocument | null> {
    return DailyInventory.findById(id);
  }

  findByIdWithSession(inventoryId: string, session: ClientSession) {
    return DailyInventory.findById(inventoryId).session(session);
  }

  create(payload: CreateInventoryPayload) {
    return DailyInventory.create(payload);
  }

  updatePublishedItem(
    inventoryId: Types.ObjectId,
    itemId: Types.ObjectId,
    changes: {
      availableQty?: number;
      marketPrice?: number;
      sellerPrice?: number;
      isNegotiable?: boolean;
      displayOrder?: number;
      imageOverride?: string | null;
    },
    session: ClientSession,
  ) {
    const $set: Record<string, unknown> = {};

    if (changes.availableQty !== undefined) {
      $set["items.$[item].availableQty"] = changes.availableQty;
    }

    if (changes.marketPrice !== undefined) {
      $set["items.$[item].marketPrice"] = changes.marketPrice;
    }

    if (changes.sellerPrice !== undefined) {
      $set["items.$[item].sellerPrice"] = changes.sellerPrice;
    }

    if (changes.isNegotiable !== undefined) {
      $set["items.$[item].isNegotiable"] = changes.isNegotiable;
    }

    if (changes.displayOrder !== undefined) {
      $set["items.$[item].displayOrder"] = changes.displayOrder;
    }

    if (changes.imageOverride !== undefined) {
      $set["items.$[item].imageOverride"] = changes.imageOverride;
    }

    return DailyInventory.findOneAndUpdate(
      {
        _id: inventoryId,
        status: STATUS.PUBLISHED,

        // Also make sure item exists
        "items._id": itemId,
      },
      {
        $set,
      },
      {
        arrayFilters: [
          {
            "item._id": itemId,
          },
        ],
        new: true,
        session,
      },
    );
  }

  findPublishedBySellerAndDate(
    sellerProfileId: string,
    inventoryDate: Date,
  ): Promise<DailyInventoryDocument | null> {
    return DailyInventory.findOne({
      sellerProfileId,
      inventoryDate,
      status: STATUS.PUBLISHED,
    }).populate({
      path: "items.vegetableId",
      select: "_id name imageUrl displayNames searchAliases",
    });
  }

  reserveInventoryItemQuantity(
    inventoryId: Types.ObjectId,
    inventoryItemId: Types.ObjectId,
    quantity: number,
    session: ClientSession,
  ) {
    return DailyInventory.collection.findOneAndUpdate(
      {
        _id: inventoryId,

        status: STATUS.PUBLISHED,

        items: {
          $elemMatch: {
            _id: inventoryItemId,

            // Enough currently available stock
            availableQty: {
              $gte: quantity,
            },
          },
        },
      },

      {
        $inc: {
          "items.$[item].availableQty": -quantity,
          "items.$[item].committedQty": quantity,
        },
      },

      {
        arrayFilters: [
          {
            "item._id": inventoryItemId,
          },
        ],

        returnDocument: "after",
        session,
      },
    );
  }

  releaseInventoryItemQuantity(
    inventoryId: Types.ObjectId,
    inventoryItemId: Types.ObjectId,
    quantity: number,
    session: ClientSession,
  ) {
    return DailyInventory.collection.findOneAndUpdate(
      {
        _id: inventoryId,

        items: {
          $elemMatch: {
            _id: inventoryItemId,

            committedQty: {
              $gte: quantity,
            },
          },
        },
      },

      {
        $inc: {
          "items.$[item].availableQty": quantity,
          "items.$[item].committedQty": -quantity,
        },
      },

      {
        arrayFilters: [
          {
            "item._id": inventoryItemId,
          },
        ],

        returnDocument: "after",
        session,
      },
    );
  }

  reserveListedItem(
    inventoryId: Types.ObjectId,
    inventoryItemId: Types.ObjectId,
    quantity: number,
    session: ClientSession,
  ) {
    return DailyInventory.collection.findOneAndUpdate(
      {
        _id: inventoryId,

        status: STATUS.PUBLISHED,

        items: {
          $elemMatch: {
            _id: inventoryItemId,

            availableQty: {
              $gte: quantity,
            },
          },
        },
      },

      {
        $inc: {
          "items.$[item].availableQty": -quantity,
          "items.$[item].committedQty": quantity,
        },
      },

      {
        arrayFilters: [
          {
            "item._id": inventoryItemId,
          },
        ],

        returnDocument: "after",

        session,
      },
    );
  }

  consumeCommittedInventoryQuantity(
    inventoryId: Types.ObjectId,
    inventoryItemId: Types.ObjectId,
    quantity: number,
    session: ClientSession,
  ) {
    return DailyInventory.collection.findOneAndUpdate(
      {
        _id: inventoryId,

        items: {
          $elemMatch: {
            _id: inventoryItemId,
            committedQty: {
              $gte: quantity,
            },
          },
        },
      },

      {
        $inc: {
          "items.$[item].committedQty": -quantity,
        },
      },

      {
        arrayFilters: [
          {
            "item._id": inventoryItemId,
          },
        ],

        returnDocument: "after",
        session,
      },
    );
  }

  save(inventory: DailyInventoryDocument) {
    return inventory.save();
  }
}

export const dailyInventoryRepository = new DailyInventoryRepository();

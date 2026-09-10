import { Types } from "mongoose";
import { dailyInventoryRepository } from "./dailyInventory.repository";
import { ApiError } from "../../../utils/ApiError";
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  UpdatePublishedInventoryDto,
} from "./dailyInventory.dto";
import {
  getTodayBusinessDate,
  getYesterdayBusinessDate,
} from "../../../utils/businessDate";
import { MODE, STATUS } from "./dailyInventory.constants";
import {
  CreateInventoryItemPayload,
  CreateInventoryPayload,
  DailyInventoryItem,
  UnitType,
} from "./dailyInventory.types";
import { Vegetable } from "../../vegetable/vegetable.model";
import { VegetableDocument } from "../../vegetable/vegetable.types";
import { vegetableRepository } from "../../vegetable/vegetable.repository";
import { sellerRepository } from "../../seller/seller.repository";
import { sellerShop } from "./dailyInventory.mapper";
import mongoose from "mongoose";
import { sellerReviewService } from "../../review/seller/seller-review.service";
import { logger } from "../../../config/logger";
import { savedSellerRepository } from "../../saved-seller/saved-seller.repository";

class DailyInventoryService {
  private validateInventoryItems(
    items: ReadonlyArray<{
      vegetableId: string | Types.ObjectId;
      unit: UnitType;
    }>,
    vegetables: VegetableDocument[],
  ) {
    const vegetableMap = new Map(
      vegetables.map((vegetable) => [vegetable._id.toString(), vegetable]),
    );

    for (const item of items) {
      const vegetable = vegetableMap.get(item.vegetableId.toString());

      if (!vegetable) {
        throw new ApiError(404, `Vegetable ${item.vegetableId} not found.`);
      }

      if (!vegetable.isActive) {
        throw new ApiError(400, `Vegetable "${vegetable.name}" is not active.`);
      }

      if (!vegetable.allowedUnits.includes(item.unit)) {
        throw new ApiError(
          400,
          `Unit "${item.unit}" is not allowed for "${vegetable.name}".`,
        );
      }
    }
  }

  private validatePublishInventoryItems(
    items: ReadonlyArray<DailyInventoryItem>,
  ) {
    if (!items.length) {
      throw new ApiError(400, "Empty inventory can't publish.");
    }
    for (let item of items) {
      if (item.availableQty <= 0) {
        throw new ApiError(400, "Item available quantity can't be 0");
      }
      if (item.marketPrice <= 0) {
        throw new ApiError(400, "Item market price can't be 0");
      }
      if (item.sellerPrice <= 0) {
        throw new ApiError(400, "Item selling price can't be 0");
      }
    }
  }
  async todaysInventory(sellerId: string) {
    const inventory = await dailyInventoryRepository.findBySellerAndDate({
      sellerId,
      inventoryDate: getTodayBusinessDate(),
    });
    if (!inventory) {
      throw new ApiError(404, "Today's inventory doesn't exist.");
    }

    return inventory;
  }

  async yesterdaysInventory(sellerId: string) {
    const inventory = await dailyInventoryRepository.findBySellerAndDate({
      sellerId,
      inventoryDate: getYesterdayBusinessDate(),
    });
    if (!inventory) {
      throw new ApiError(404, "Yesterday's inventory doesn't exist.");
    }

    return inventory;
  }

  async createInventory(
    sellerId: string,
    payload: CreateInventoryDto,
    mode: string,
  ) {
    if (mode === MODE.COPY) {
      const todayInventory = await dailyInventoryRepository.findBySellerAndDate(
        {
          sellerId,
          inventoryDate: getTodayBusinessDate(),
        },
      );
      if (todayInventory) {
        throw new ApiError(409, "Today's inventory already exist.");
      }
      const yesterdayInventory =
        await dailyInventoryRepository.findBySellerAndDate({
          sellerId,
          inventoryDate: getYesterdayBusinessDate(),
        });
      if (!yesterdayInventory) {
        throw new ApiError(404, "Yesterday's inventory doesn't exist.");
      }

      const skippedItems = [];
      const copyInventoryItems = [];

      const vegetableIds = yesterdayInventory.items.map(
        (item) => item.vegetableId,
      );
      const vegetables = await Vegetable.find({
        _id: { $in: vegetableIds },
      });
      const vegetablesMap = new Map(
        vegetables.map((vegetable) => [vegetable._id.toString(), vegetable]),
      );

      for (let item of yesterdayInventory.items) {
        const vegetable = vegetablesMap.get(item.vegetableId.toString());
        const errors = [];
        if (!vegetable) {
          skippedItems.push({
            vegetableId: item.vegetableId.toString(),
            reason: ["Vegetable doesn't exist."],
          });

          continue;
        }
        if (!vegetable.isActive) {
          errors.push("Vegetable is not active");
        }
        if (!vegetable.allowedUnits.includes(item.unit)) {
          errors.push(`${item.unit} is not allowed`);
        }

        if (errors.length) {
          skippedItems.push({
            vegetableId: item.vegetableId.toString(),
            vegetableName: vegetable.name,
            reason: errors,
          });
        } else {
          copyInventoryItems.push(item);
        }
      }

      const newItems: CreateInventoryItemPayload[] = copyInventoryItems.map(
        (item) => ({
          vegetableId: item.vegetableId,
          unit: item.unit,
          availableQty: 0,
          committedQty: 0,
          marketPrice: item.marketPrice,
          sellerPrice: item.sellerPrice,
          isNegotiable: item.isNegotiable,
          displayOrder: item.displayOrder,

          ...(item.imageOverride != null && {
            imageOverride: item.imageOverride,
          }),
        }),
      );

      const newInventory = {
        sellerProfileId: new Types.ObjectId(sellerId),
        status: STATUS.DRAFT,
        inventoryDate: getTodayBusinessDate(),
        items: yesterdayInventory.items.length ? newItems : [],
      };

      const newInventoryRes =
        await dailyInventoryRepository.create(newInventory);
      return {
        inventoryDetails: newInventoryRes,
        skippedItems,
      };
    }

    if (mode === MODE.FRESH) {
      const inventory = await dailyInventoryRepository.findBySellerAndDate({
        sellerId,
        inventoryDate: getTodayBusinessDate(),
      });
      if (inventory) {
        throw new ApiError(409, "Today's inventory already exist.");
      }

      const createInventoryData: CreateInventoryPayload = {
        sellerProfileId: new Types.ObjectId(sellerId),
        status: STATUS.DRAFT,
        inventoryDate: getTodayBusinessDate(),
        items: [],
      };

      if (payload.items && payload.items.length) {
        const vegetableIds = payload.items.map((item) => item.vegetableId);
        const vegetables = await vegetableRepository.findByIds(vegetableIds);
        this.validateInventoryItems(payload.items, vegetables);
        createInventoryData.items = payload.items.map((item) => ({
          vegetableId: item.vegetableId,
          unit: item.unit,
          availableQty: item.availableQty,
          committedQty: 0,
          marketPrice: item.marketPrice,
          sellerPrice: item.sellerPrice,
          isNegotiable: item.isNegotiable,
          displayOrder: item.displayOrder,
          ...(item.imageOverride !== undefined && {
            imageOverride: item.imageOverride,
          }),
        }));
      }

      const newInventory =
        await dailyInventoryRepository.create(createInventoryData);
      return newInventory;
    }
  }

  async updateDraftInventory(
    sellerId: string,
    inventoryId: string,
    payload: UpdateInventoryDto,
  ) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exit.");
    }
    if (sellerId.toString() !== inventory.sellerProfileId.toString()) {
      throw new ApiError(403, "This inventory doesn't belongs to you.");
    }

    if (inventory.status !== "DRAFT") {
      throw new ApiError(400, "Only draft inventory can be fully updated.");
    }

    const items = payload.items ?? [];

    if (items.length) {
      const vegetableIds = items.map((item) => item.vegetableId);
      const vegetables = await vegetableRepository.findByIds(vegetableIds);
      this.validateInventoryItems(items, vegetables);
    }
    inventory.set("items", items);
    const updatedInventory = dailyInventoryRepository.save(inventory);
    return updatedInventory;
  }

  async publishInventory(sellerId: string, inventoryId: string) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    if (sellerId.toString() !== inventory.sellerProfileId.toString()) {
      throw new ApiError(403, "Inventory doesn't belongs to you.");
    }

    if (inventory.status !== "DRAFT") {
      throw new ApiError(400, "Only draft inventory can publish.");
    }

    const vegetableIds = inventory.items.map((item) => item.vegetableId);
    const vegetables = await vegetableRepository.findByIds(vegetableIds);
    const seller = await sellerRepository.findByIdWithUser(sellerId);

    this.validateInventoryItems(inventory.items, vegetables);
    this.validatePublishInventoryItems(inventory.items);

    inventory.status = "PUBLISHED";
    const response = await dailyInventoryRepository.save(inventory);
    return response;
  }
  async updatePublishedInventory(
    sellerId: string,
    inventoryId: string,
    payload: UpdatePublishedInventoryDto,
  ) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    if (sellerId.toString() !== inventory.sellerProfileId.toString()) {
      throw new ApiError(403, "Inventory doesn't belong to you.");
    }

    if (inventory.status !== STATUS.PUBLISHED) {
      throw new ApiError(400, "Only published inventory can be updated.");
    }

    // ---------------------------
    // Validate requested items
    // ---------------------------

    const inventoryItems = payload.items.map((item) => {
      const inventoryItem = inventory.items.id(item.itemId);

      if (!inventoryItem) {
        throw new ApiError(404, `Inventory item ${item.itemId} doesn't exist.`);
      }

      return {
        payload: item,
        inventoryItem,
      };
    });

    const vegetableIds = inventoryItems.map(
      ({ inventoryItem }) => inventoryItem.vegetableId,
    );

    const vegetables = await vegetableRepository.findByIds(vegetableIds);

    this.validateInventoryItems(
      inventoryItems.map(({ inventoryItem }) => ({
        vegetableId: inventoryItem.vegetableId,
        unit: inventoryItem.unit,
      })),
      vegetables,
    );

    // ---------------------------
    // Atomic multi-item update
    // ---------------------------

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        for (const { payload: item } of inventoryItems) {
          const updated = await dailyInventoryRepository.updatePublishedItem(
            inventory._id,
            new Types.ObjectId(item.itemId),
            item,
            session,
          );

          if (!updated) {
            throw new ApiError(
              409,
              `Inventory item ${item.itemId} could not be updated.`,
            );
          }
        }
      });
    } finally {
      await session.endSession();
    }

    // Get final DB state after transaction
    const updatedInventory =
      await dailyInventoryRepository.findById(inventoryId);

    if (!updatedInventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    return updatedInventory;
  }

  async makeInventoryUnavailable(sellerId: string, inventoryId: string) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    if (inventory.sellerProfileId.toString() !== sellerId.toString()) {
      throw new ApiError(403, "This inventory doesn't belong to you.");
    }

    if (inventory.status !== STATUS.PUBLISHED) {
      throw new ApiError(
        400,
        "Only published inventory can be made unavailable.",
      );
    }

    inventory.status = STATUS.UNAVAILABLE;

    return dailyInventoryRepository.save(inventory);
  }

  async makeInventoryAvailable(sellerId: string, inventoryId: string) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    if (inventory.sellerProfileId.toString() !== sellerId.toString()) {
      throw new ApiError(403, "This inventory doesn't belong to you.");
    }

    if (inventory.status !== STATUS.UNAVAILABLE) {
      throw new ApiError(
        400,
        "Only unavailable inventory can be made available.",
      );
    }

    inventory.status = STATUS.PUBLISHED;

    return dailyInventoryRepository.save(inventory);
  }

  async archiveInventory(sellerId: string, inventoryId: string) {
    const inventory = await dailyInventoryRepository.findById(inventoryId);

    if (!inventory) {
      throw new ApiError(404, "Inventory doesn't exist.");
    }

    if (inventory.sellerProfileId.toString() !== sellerId.toString()) {
      throw new ApiError(403, "This inventory doesn't belong to you.");
    }

    if (
      inventory.status !== STATUS.PUBLISHED &&
      inventory.status !== STATUS.UNAVAILABLE
    ) {
      throw new ApiError(
        400,
        "Only published or unavailable inventory can be archived.",
      );
    }

    inventory.status = STATUS.ARCHIVED;

    return dailyInventoryRepository.save(inventory);
  }

  async sellerShop(sellerId: string, userId: string) {
    const seller = await sellerRepository.findByIdWithUser(sellerId);
    if (!seller) {
      throw new ApiError(404, "Seller doesn't exist.");
    }
    const inventoryDate = getTodayBusinessDate();
    const inventory =
      await dailyInventoryRepository.findPublishedBySellerAndDate(
        sellerId,
        inventoryDate,
      );
    if (!inventory) {
      throw new ApiError(404, "Seller doesn't have published inventory today.");
    }

    const [reputation, savedSeller] = await Promise.all([
      sellerReviewService.getSellerReputation(
        new Types.ObjectId(sellerId as string),
      ),
      userId
        ? savedSellerRepository.findOne(
            new Types.ObjectId(userId),
            new Types.ObjectId(sellerId),
          )
        : Promise.resolve(null),
    ]);

    let isSaved = false;

    if (savedSeller) {
      isSaved = true;
    }

    return sellerShop(seller, inventory, reputation, isSaved);
  }
}

export const dailyInventoryService = new DailyInventoryService();

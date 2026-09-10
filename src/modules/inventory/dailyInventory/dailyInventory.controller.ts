import { Types } from "mongoose";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { sellerReviewService } from "../../review/seller/seller-review.service";
import { dailyInventoryService } from "./dailyInventory.service";
import { logger } from "../../../config/logger";

class DailyInventoryController {
  todaysInventory = catchAsync(async (req, res) => {
    const sellerId = req.sellerId ?? "";
    const inventory = await dailyInventoryService.todaysInventory(sellerId);

    sendResponse(res, {
      statusCode: 200,
      message: "Today's inventory.",
      data: inventory,
    });
  });
  yesterdaysInventory = catchAsync(async (req, res) => {
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.yesterdaysInventory(sellerId);

    sendResponse(res, {
      statusCode: 200,
      message: "Yesterday's inventory.",
      data: inventory,
    });
  });
  create = catchAsync(async (req, res) => {
    const { mode } = req.params;
    const sellerId = req?.sellerId ?? "";
    const inventory = await dailyInventoryService.createInventory(
      sellerId,
      req.body,
      mode as string,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory created.",
      data: inventory,
    });
  });
  updateDraft = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.updateDraftInventory(
      sellerId,
      inventoryId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory updated.",
      data: inventory,
    });
  });
  publish = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";
    const inventory = await dailyInventoryService.publishInventory(
      sellerId,
      inventoryId as string,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory published.",
      data: inventory,
    });
  });
  updatePublish = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.updatePublishedInventory(
      sellerId,
      inventoryId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory updated.",
      data: inventory,
    });
  });
  makeInventoryUnavailable = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.makeInventoryUnavailable(
      sellerId,
      inventoryId as string,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory marked unavailable.",
      data: inventory,
    });
  });
  makeInventoryAvailable = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.makeInventoryAvailable(
      sellerId,
      inventoryId as string,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory marked available.",
      data: inventory,
    });
  });
  archiveInventory = catchAsync(async (req, res) => {
    const { inventoryId } = req.params;
    const sellerId = req.sellerId ?? "";

    const inventory = await dailyInventoryService.archiveInventory(
      sellerId,
      inventoryId as string,
    );

    sendResponse(res, {
      statusCode: 201,
      message: "Inventory marked archived.",
      data: inventory,
    });
  });

  sellerShop = catchAsync(async (req, res) => {
    const { sellerId } = req.params;
    const userId = req.user?.userId ?? "";

    const shop = await dailyInventoryService.sellerShop(sellerId as string, userId);

    sendResponse(res, {
      statusCode: 200,
      message: "Seller shop items fetched successully.",
      data: shop,
    });
  });
}

export const dailyInventoryController = new DailyInventoryController();

import { Router } from "express";
import { requireAuth } from "../../../middlewares/requireAuth";
import { requireVerifiedSeller } from "../../../middlewares/requireVerifiedSeller";
import { dailyInventoryController } from "./dailyInventory.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import {
  createDraftInventorySchema,
  inventorySchemaId,
  updateDraftInventorySchema,
  updatePublishedInventorySchema,
} from "./dailyInventory.validations";

const dailyInventoryRouter = Router();

dailyInventoryRouter.get(
  "/today",
  requireAuth,
  requireVerifiedSeller,
  dailyInventoryController.todaysInventory,
);

dailyInventoryRouter.get(
  "/yesterday",
  requireAuth,
  requireVerifiedSeller,
  dailyInventoryController.yesterdaysInventory,
);

dailyInventoryRouter.post(
  "/create/:mode",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(createDraftInventorySchema),
  dailyInventoryController.create,
);

dailyInventoryRouter.patch(
  "/draft/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(updateDraftInventorySchema),
  dailyInventoryController.updateDraft,
);

dailyInventoryRouter.patch(
  "/publish/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  dailyInventoryController.publish,
);

dailyInventoryRouter.patch(
  "/published/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(updatePublishedInventorySchema),
  dailyInventoryController.updatePublish,
);

dailyInventoryRouter.patch(
  "/make-unavailable/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(inventorySchemaId),
  dailyInventoryController.makeInventoryUnavailable,
);

dailyInventoryRouter.patch(
  "/make-available/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(inventorySchemaId),
  dailyInventoryController.makeInventoryAvailable,
);

dailyInventoryRouter.patch(
  "/archive/:inventoryId",
  requireAuth,
  requireVerifiedSeller,
  validateRequest(inventorySchemaId),
  dailyInventoryController.archiveInventory,
);

export default dailyInventoryRouter;

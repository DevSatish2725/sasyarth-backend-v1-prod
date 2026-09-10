import { Router } from "express";
import { sellerController } from "../seller/seller.controller";
import { dailyInventoryController } from "../inventory/dailyInventory/dailyInventory.controller";
import { optionalAuth } from "../../middlewares/optionalAuth";
import { sellerSchemaId } from "../seller/seller.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { sellerReviewController } from "../review/seller/seller-review-controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { savedSellerParamsSchema } from "../saved-seller/saved-seller.validations";
import { savedSellerController } from "../saved-seller/saved-seller.controller";

const sellersRouter = Router();

sellersRouter.get("/", optionalAuth, sellerController.getSellerListing);

sellersRouter.get("/:sellerId", requireAuth, validateRequest(sellerSchemaId), sellerController.getCallSellerDetails)

sellersRouter.get(
  "/:sellerId/shop",
  optionalAuth,
  validateRequest(sellerSchemaId),
  dailyInventoryController.sellerShop,
);

sellersRouter.get(
  "/:sellerProfileId/reviews",
  sellerReviewController.getSellerReviews,
);

sellersRouter.post(
  "/:sellerProfileId/save",
  requireAuth,
  validateRequest(savedSellerParamsSchema),
  savedSellerController.saveSeller,
);

sellersRouter.delete(
  "/:sellerProfileId/save",
  requireAuth,
  validateRequest(savedSellerParamsSchema),
  savedSellerController.removeSavedSeller,
);

sellersRouter.get("/saved", requireAuth, savedSellerController.getSavedSellers);

export default sellersRouter;

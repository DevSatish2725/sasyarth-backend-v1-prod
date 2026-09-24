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
import {
  createSellerRatingSchema,
  sellerIdSchema,
  updateSellerRatingSchema,
} from "../seller-rating/sellerRating.validation";
import { sellerRatingController } from "../seller-rating/sellerRating.controller";

const sellersRouter = Router();

sellersRouter.get("/", optionalAuth, sellerController.getSellerListing);

sellersRouter.get("/saved", requireAuth, savedSellerController.getSavedSellers);

sellersRouter.get(
  "/:sellerId/contact",
  requireAuth,
  validateRequest(sellerSchemaId),
  sellerController.getCallSellerDetails,
);

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

sellersRouter.post(
  "/:sellerId/ratings",
  requireAuth,
  validateRequest(createSellerRatingSchema),
  sellerRatingController.create,
);

sellersRouter.get(
  "/:sellerId/ratings/me",
  requireAuth,
  validateRequest(sellerIdSchema),
  sellerRatingController.getMySellerRatingStatus,
);

sellersRouter.get(
  "/:sellerId/ratings/summary",
  validateRequest(sellerIdSchema),
  sellerRatingController.getRatingSummary,
);

sellersRouter.patch(
  "/:sellerId/ratings/me",
  requireAuth,
  validateRequest(updateSellerRatingSchema),
  sellerRatingController.updateSellerRating,
);

export default sellersRouter;

import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  adminSellerListSchema,
  adminSellerParamsSchema,
  blockSellerSchema,
  rejectSellerSchema,
} from "./admin.validation";
import { sellerController } from "../seller/seller.controller";

const adminRouter = Router();

adminRouter.get(
  "/sellers",
  requireAuth,
  requireAdmin,
  validateRequest(adminSellerListSchema),
  sellerController.adminList,
);

adminRouter.get(
  "/sellers/:sellerId",
  requireAuth,
  requireAdmin,
  validateRequest(adminSellerParamsSchema),
  sellerController.adminDetails,
);

adminRouter.patch(
  "/sellers/:sellerId/approve",
  requireAuth,
  requireAdmin,
  validateRequest(adminSellerParamsSchema),
  sellerController.approve,
);

adminRouter.patch(
  "/sellers/:sellerId/reject",
  requireAuth,
  requireAdmin,
  validateRequest(rejectSellerSchema),
  sellerController.reject,
);

adminRouter.patch(
  "/sellers/:sellerId/block",
  requireAuth,
  requireAdmin,
  validateRequest(blockSellerSchema),
  sellerController.block,
);

adminRouter.patch(
  "/sellers/:sellerId/unblock",
  requireAuth,
  requireAdmin,
  validateRequest(adminSellerParamsSchema),
  sellerController.unblock,
);

export default adminRouter;

import { Router } from "express";
import { sellerController } from "./seller.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { applySchema, reApplySchema } from "./seller.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const sellerRouter = Router();

sellerRouter.post(
  "/apply",
  requireAuth,
  validateRequest(applySchema),
  sellerController.apply,
);

sellerRouter.get("/me", requireAuth, sellerController.me);

sellerRouter.patch(
  "/me",
  requireAuth,
  validateRequest(reApplySchema),
  sellerController.reApply,
);

export default sellerRouter;

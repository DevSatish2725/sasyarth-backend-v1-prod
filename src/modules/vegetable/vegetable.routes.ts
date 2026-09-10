import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { vegetableController } from "./vegetable.controller";
import { createVegetableSchema } from "./vegetable.validation";
import { requireVerifiedSeller } from "../../middlewares/requireVerifiedSeller";

const vegetableRouter = Router();

vegetableRouter.get(
  "/",
  requireAuth,
  requireVerifiedSeller,
  vegetableController.getActiveList,
);

export default vegetableRouter;

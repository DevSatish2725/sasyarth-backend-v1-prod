import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validateRequest } from "../../middlewares/validateRequest";
import { vegetableController } from "./vegetable.controller";
import {
  createVegetableSchema,
  updateVegetableSchema,
} from "./vegetable.validation";

const adminVegetableRouter = Router();

adminVegetableRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  validateRequest(createVegetableSchema),
  vegetableController.create,
);

adminVegetableRouter.get(
  "/",
  requireAuth,
  requireAdmin,
  vegetableController.getAdminList,
);

adminVegetableRouter.get(
  "/:vegetableId",
  requireAuth,
  requireAdmin,
  vegetableController.getById,
);

adminVegetableRouter.patch(
  "/:vegetableId",
  requireAuth,
  requireAdmin,
  validateRequest(updateVegetableSchema),
  vegetableController.update,
);

adminVegetableRouter.patch(
  "/:vegetableId/activate",
  requireAuth,
  requireAdmin,
  vegetableController.activate,
);

adminVegetableRouter.patch(
  "/:vegetableId/deactivate",
  requireAuth,
  requireAdmin,
  vegetableController.deactivate,
);

export default adminVegetableRouter;

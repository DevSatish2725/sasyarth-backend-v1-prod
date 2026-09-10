import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { updateProfileSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.patch(
  "/me",
  requireAuth,
  validateRequest(updateProfileSchema),
  userController.updateProfile,
);

export default userRouter;

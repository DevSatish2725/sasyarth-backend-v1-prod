import { Router } from "express";
import { locationController } from "./location.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  searchDistrictSchema,
  searchVillageSchema,
} from "./location.validation";

const locationRouter = Router();

locationRouter.get("/states", locationController.getStateList);
locationRouter.get(
  "/states/:stateId/districts",
  validateRequest(searchDistrictSchema),
  locationController.getDistricts,
);
locationRouter.get(
  "/districts/:districtId/villages",
  validateRequest(searchVillageSchema),
  locationController.getVillages,
);

export default locationRouter;

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { locationService } from "./location.service";
import { SearchVillageParams, SearchDistrictParams } from "./location.types";
class LocationController {
  getStateList = catchAsync(async (_req, res) => {
    const states = await locationService.getStateList();
    sendResponse(res, {
      statusCode: 200,
      data: states,
      message: "States fetched successfully",
    });
  });

  getDistricts = catchAsync(async (req, res) => {
    const { search, limit } = req.query;
    const { stateId } = req.params;
    const params: SearchDistrictParams = {
      stateId: stateId as string,
      ...(search && { search: search as string }),
      ...(limit && { limit: parseInt(limit as string) }),
    };
    const districts = await locationService.getDistricts(params);
    sendResponse(res, {
      statusCode: 200,
      data: districts,
      message: "Districts fetched successfully",
    });
  });

  getVillages = catchAsync(async (req, res) => {
    const { search, limit } = req.query;
    const { districtId } = req.params;

    const params: SearchVillageParams = {
      districtId: districtId as string,
      ...(search && { search: search as string }),
      ...(limit && { limit: parseInt(limit as string) }),
    };
    const villages = await locationService.getVillages(params);
    sendResponse(res, {
      statusCode: 200,
      data: villages,
      message: "Villages fetched successfully",
    });
  });
}

export const locationController = new LocationController();

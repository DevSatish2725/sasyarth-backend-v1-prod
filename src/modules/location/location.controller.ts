import { ApiError } from "../../utils/ApiError";
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

  getLocations = catchAsync(async (req, res) => {
    const DEFAULT_LIMIT = 10;
    const MAX_LIMIT = 20;
    const MIN_QUERY_LENGTH = 2;
    const MAX_QUERY_LENGTH = 80;

    function escapeRegex(value: string): string {
      return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function parseLimit(value: unknown): number | null {
      if (value === undefined) return DEFAULT_LIMIT;

      if (typeof value !== "string" || !/^\d+$/.test(value)) {
        return null;
      }

      const parsed = Number(value);

      if (!Number.isSafeInteger(parsed) || parsed < 1) {
        return null;
      }

      return Math.min(parsed, MAX_LIMIT);
    }

    const limit = parseLimit(req.query.limit) ?? 10;

    const rawQuery = req.query.q as string;

    if (typeof rawQuery !== "string") {
      throw new ApiError(400, "Query parameter 'q' is required.");
    }

    const q = rawQuery.trim().normalize("NFC");

    if (q.length < MIN_QUERY_LENGTH) {
      throw new ApiError(400, `Enter at least ${MIN_QUERY_LENGTH} characters.`);
    }

    if (q.length > MAX_QUERY_LENGTH) {
      throw new ApiError(
        400,
        `Search query cannot exceed ${MAX_QUERY_LENGTH} characters.`,
      );
    }

    // Prefix matching avoids searching every position in each name.
    const searchRegex = new RegExp(`^${escapeRegex(q)}`, "i");

    const result = await locationService.getLocations(searchRegex, limit);

    sendResponse(res, {
      statusCode: 200,
      message: "Locations fetched successfully.",
      data: result,
      meta: {
        count: result.length,
        limit,
        query: q,
      },
    });
  });
}

export const locationController = new LocationController();

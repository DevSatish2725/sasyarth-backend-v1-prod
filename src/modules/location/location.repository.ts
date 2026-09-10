import { State } from "./models/state.model";
import { District } from "./models/district.model";
import { Village } from "./models/village.model";
import { Types } from "mongoose";
import { escapeRegex } from "../../utils/escapeRegext";
import { SearchDistrictParams, SearchVillageParams } from "./location.types";

class LocationRepository {
  findAllStates() {
    return State.find().lean();
  }
  findStateByName(name: string) {
    return State.findOne({ name });
  }
  findDistrictByNameAndStateId(name: string, stateId: Types.ObjectId) {
    return District.findOne({
      name,
      stateId,
    }).lean();
  }

  findDistrictByStateId(stateId: Types.ObjectId) {
    return District.find({
      stateId,
    }).lean();
  }

  findVillageByNameAndDistrictId(name: string, districtId: Types.ObjectId) {
    return Village.findOne({
      name,
      districtId,
    }).lean();
  }

  findVillageByDistrictId(districtId: Types.ObjectId) {
    return Village.find({
      districtId,
    }).lean();
  }

  searchDistricts({
  stateId,
  search,
  limit = 20,
}: SearchDistrictParams) {
  const filter: Record<string, unknown> = {
    stateId: new Types.ObjectId(stateId),
  };

  if (search?.trim()) {
    const normalizedSearch =
      search.trim().toLowerCase();

    const safeSearch =
      escapeRegex(normalizedSearch);

    filter.searchName = {
      $regex: `^${safeSearch}`,
    };
  }

  return District.find(filter)
    .select({
      _id: 1,
      name: 1,
    })
    .sort({
      searchName: 1,
    })
    .limit(limit)
    .lean();
}
  searchVillages({ districtId, search, limit=20 }: SearchVillageParams) {
   const filter: Record<string, unknown> = {
    districtId: new Types.ObjectId(districtId),
  };

  if (search?.trim()) {
    const normalizedSearch =
      search.trim().toLowerCase();

    const safeSearch =
      escapeRegex(normalizedSearch);

    filter.searchName = {
      $regex: `^${safeSearch}`,
    };
  }


    return Village.find(filter)
      .select({
        _id: 1,
        name: 1,
      })
      .sort({
        searchName: 1,
      })
      .limit(limit)
      .lean();
  }
}

export const locationRepository = new LocationRepository();

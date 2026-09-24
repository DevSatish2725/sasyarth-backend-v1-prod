import { State } from "./models/state.model";
import { District } from "./models/district.model";
import { Village } from "./models/village.model";
import { Types } from "mongoose";
import { escapeRegex } from "../../utils/escapeRegext";
import { SearchDistrictParams, SearchVillageParams } from "./location.types";

class LocationRepository {
  findAllStates() {
    return State.find().select("_id name").lean().exec();
  }
  findStateById(id: Types.ObjectId) {
    return State.findById(id).select("_id name").lean().exec();
  }
  findStateByName(name: string) {
    return State.findOne({ name }).select("_id name").lean().exec();
  }

  findDistrictById(id: Types.ObjectId) {
    return District.findById(id).select("_id name").lean().exec();
  }
  findDistrictByNameAndStateId(name: string, stateId: Types.ObjectId) {
    return District.findOne({
      name,
      stateId,
    })
      .select("_id name")
      .lean()
      .exec();
  }

  findDistrictByStateId(stateId: Types.ObjectId) {
    return District.find({
      stateId,
    })
      .select("_id name")
      .lean()
      .exec();
  }

  findVillageById(id: Types.ObjectId) {
    return Village.findById(id).select("_id name").lean().exec();
  }
  findVillageByNameAndDistrictId(name: string, districtId: Types.ObjectId) {
    return Village.findOne({
      name,
      districtId,
    })
      .select("_id name")
      .lean()
      .exec();
  }

  findVillageByDistrictId(districtId: Types.ObjectId) {
    return Village.find({
      districtId,
    })
      .select("_id name")
      .lean()
      .exec();
  }

  searchDistricts({ stateId, search, limit = 20 }: SearchDistrictParams) {
    const filter: Record<string, unknown> = {
      stateId: new Types.ObjectId(stateId),
    };

    if (search?.trim()) {
      const normalizedSearch = search.trim().toLowerCase();

      const safeSearch = escapeRegex(normalizedSearch);

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
      .select("_id name")
      .lean()
      .exec();
  }
  searchVillages({ districtId, search, limit = 20 }: SearchVillageParams) {
    const filter: Record<string, unknown> = {
      districtId: new Types.ObjectId(districtId),
    };

    if (search?.trim()) {
      const normalizedSearch = search.trim().toLowerCase();

      const safeSearch = escapeRegex(normalizedSearch);

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
      .select("_id name")
      .lean()
      .exec();
  }
}

export const locationRepository = new LocationRepository();

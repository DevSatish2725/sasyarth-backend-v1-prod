import { Types } from "mongoose";
import { locationRepository } from "./location.repository";
import { SearchDistrictParams, SearchVillageParams } from "./location.types";
import { getDistrict, getState, getVillage } from "./location.mapper";
import { ApiError } from "../../utils/ApiError";

class LocationService {
  async getStateList() {
    const states = await locationRepository.findAllStates();
    return states.map(getState);
  }

  async getDistricts(params: SearchDistrictParams) {
    const districts = await locationRepository.searchDistricts(params);
    return districts.map(getDistrict);
  }

  async getVillages(params: SearchVillageParams) {
    const villages = await locationRepository.searchVillages(params);
    return villages.map(getVillage);
  }

  async getLocations(searchRegex: RegExp, limit: number) {
    return locationRepository.findLocations(searchRegex, limit);
  }
}

export const locationService = new LocationService();

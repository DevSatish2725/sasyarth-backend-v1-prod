import { Types } from "mongoose";
import { locationRepository } from "./location.repository";
import { SearchDistrictParams, SearchVillageParams } from "./location.types";

class LocationService {
    async getStateList() {
        const states = await locationRepository.findAllStates();
        return states;
    }

    async getDistricts(params: SearchDistrictParams) {
        const districts = await locationRepository.searchDistricts(params);
        return districts;
    }

    async getVillages(params: SearchVillageParams) {
        const villages = await locationRepository.searchVillages(params);
        return villages;
    }
}

export const locationService = new LocationService();
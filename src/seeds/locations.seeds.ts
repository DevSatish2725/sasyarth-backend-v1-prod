import { State } from "../modules/location/models/state.model";
import { District } from "../modules/location/models/district.model";
import { Village } from "../modules/location/models/village.model";
import { logger } from "../config/logger";
import { Types } from "mongoose";

type DistrictSeed = {
  lgdCode: number;
  name: string;
  searchName?: string;
  stateId?: Types.ObjectId;
};

type VillageSeed = {
  lgdCode: number;
  name: string;
  searchName?: string;
  pincode: string;
  districtId?: Types.ObjectId;
};

const stateSeeds = [
  {
    lgdCode: 9,
    name: "Uttar Pradesh",
    code: "UP",
  },
];

const districtSeeds: Record<string, DistrictSeed[]> = {
  UP: [{ lgdCode: 140, name: "Ayodhya" }],
};

const villageSeeds: Record<string, VillageSeed[]> = {
  Ayodhya: [{ lgdCode: 165998, name: "Tindauli", pincode: "224229" }],
};

export const seedLocations = async () => {
  for (const stateDetails of stateSeeds) {
    const state = await State.findOne({ name: stateDetails.name });
    if (state) {
      logger.info(`${state.name} already exists.`);
      continue;
    }
    const newState = await State.create(stateDetails);

    const districts = districtSeeds[stateDetails.code];
    if (!districts) {
      logger.warn(`No district seed data for state: ${stateDetails.code}`);
      continue;
    }

    for (const districtDetails of districts) {
      const district = await District.findOne({ name: districtDetails.name });
      if (district) {
        logger.info(`${district.name} already exists.`);
        continue;
      }
      districtDetails.stateId = newState._id;
      districtDetails.searchName = districtDetails.name.trim().toLowerCase();
      const newDistrict = await District.create(districtDetails);

      const villages = villageSeeds[districtDetails.name];
      if (!villages) {
        logger.warn(
          `No village seed data for district: ${districtDetails.name}`,
        );
        continue;
      }

      for (const villageDetails of villages) {
        const village = await Village.findOne({ name: villageDetails.name });
        if (village) {
          logger.info(`${village.name} already exists.`);
          continue;
        }
        villageDetails.districtId = newDistrict._id;
        villageDetails.searchName = villageDetails.name.trim().toLowerCase();
        await Village.create(villageDetails);
      }
    }
  }
};

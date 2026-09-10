import { HydratedDocument, InferSchemaType } from "mongoose";
import { StateSchema } from "./models/state.model";
import { DistrictSchema } from "./models/district.model";
import { VillageSchema } from "./models/village.model";

export type StateEntity = InferSchemaType<typeof StateSchema>;

export type StateDocument = HydratedDocument<StateEntity>;

export type DistrictEntity = InferSchemaType<typeof DistrictSchema>;

export type DistrictDocument = HydratedDocument<DistrictEntity>;

export type VillageEntity = InferSchemaType<typeof VillageSchema>;

export type VillageDocument = HydratedDocument<VillageEntity>;

export interface SearchDistrictParams {
  stateId: string;
  search?: string;
  limit?: number;
}

export interface SearchVillageParams {
  districtId: string;
  search?: string;
  limit?: number;
}

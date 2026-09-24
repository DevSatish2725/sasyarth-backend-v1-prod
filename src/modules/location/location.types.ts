import { HydratedDocument, InferSchemaType } from "mongoose";
import { StateSchema } from "./models/state.model";
import { DistrictSchema } from "./models/district.model";
import { VillageSchema } from "./models/village.model";
import { Types } from "mongoose";

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

export interface LocationWithIds {
  state: {
    id: string;
    name: string;
  };
  district: {
    id: string;
    name: string;
  };
  village: {
    id: string;
    name: string;
  };
  pincode: string;
}

export interface State {
  _id: Types.ObjectId;
  name: string;
}

export interface District {
  _id: Types.ObjectId;
  name: string;
}

export interface Village {
  _id: Types.ObjectId;
  name: string;
}
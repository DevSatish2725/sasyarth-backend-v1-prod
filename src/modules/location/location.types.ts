import { HydratedDocument, InferSchemaType } from "mongoose";
import { StateSchema } from "./models/state.model";
import { DistrictSchema } from "./models/district.model";
import { VillageSchema } from "./models/village.model";
import { Types } from "mongoose";

import { Request } from "express";

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

export interface LocationDetails {
  stateId: string;
  state: {
    en: string;
    hi: string;
  };
  districtId: string;
  district: {
    en: string;
    hi: string;
  };
  blockId: string;
  block: {
    en: string;
    hi: string;
  };
  villageId: string;
  village: {
    en: string;
    hi: string;
  };
  maujaId: string;
  mauja: {
    en: string;
    hi: string;
  };
  habitationId: string;
  habitation: {
    en: string;
    hi: string;
  };
  pincode: string;
}

export interface State {
  _id: Types.ObjectId;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export interface District {
  _id: Types.ObjectId;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export interface Village {
  _id: Types.ObjectId;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export interface LocationNames {
  en: string;
  hi: string;
}

export interface HabitationSuggestion {
  habitationId: string;
  habitation: LocationNames;
  maujaId: string;
  mauja: LocationNames;
  villageId: string;
  village: LocationNames;
  blockId: string;
  block: LocationNames;
  districtId: string;
  district: LocationNames;
  stateId: string;
  state: LocationNames;
}

export interface SearchRequest extends Request {
  query: Request["query"] & {
    q?: string;
    limit?: string;
  };
}

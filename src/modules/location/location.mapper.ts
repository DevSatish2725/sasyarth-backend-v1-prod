import { Types } from "mongoose";
import { District, State, Village } from "./location.types";

export const getState = (state: State) => ({
  id: state._id,
  name: state.name,
});
export const getDistrict = (district: District) => ({
  id: district._id,
  name: district.name,
});
export const getVillage = (village: Village) => ({
  id: village._id,
  name: village.name,
});

import { Schema } from "mongoose";

const DisplayNamesSchema = new Schema(
  {
    en: {
      type: String,
      required: true,
      trim: true,
    },

    hi: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

export const LocationSchema = new Schema(
  {
    village: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    villageDisplayNames: {
      type: DisplayNamesSchema,
      required: true,
    },
    districtDisplayNames: {
      type: DisplayNamesSchema,
      required: true,
    },
    stateDisplayNames: {
      type: DisplayNamesSchema,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

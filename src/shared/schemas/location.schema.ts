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
    habitationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    maujaId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    blockId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    villageId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    districtId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    stateId: {
      type: Schema.Types.ObjectId,
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

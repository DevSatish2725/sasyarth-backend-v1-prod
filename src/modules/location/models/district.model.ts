import { Schema, model } from "mongoose";
import { DistrictEntity } from "../location.types";

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

export const DistrictSchema = new Schema(
  {
    lgdCode: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayNames: {
      type: DisplayNamesSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

DistrictSchema.index({
  stateId: 1,
  name: 1,
});

DistrictSchema.index({
  stateId: 1,
  searchName: 1,
});

export const District = model<DistrictEntity>("District", DistrictSchema);

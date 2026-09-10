import { Schema, model } from "mongoose";
import { DistrictEntity } from "../location.types";

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
    searchName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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

import { Schema, model } from "mongoose";
import { GeoLocationSchema } from "../../../shared/schemas/geolocation.schema";

export const VillageSchema = new Schema(
  {
    lgdCode: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
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

    pincode: {
      type: String,
      required: true,
      trim: true,
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

VillageSchema.index({
  districtId: 1,
  name: 1,
});

VillageSchema.index({
  districtId: 1,
  pincode: 1,
});

VillageSchema.index({
  districtId: 1,
  searchName: 1,
});

export const Village = model("Village", VillageSchema);

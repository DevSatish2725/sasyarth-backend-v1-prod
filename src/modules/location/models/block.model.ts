import { Schema, model } from "mongoose";

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

const blockSchema = new Schema(
  {
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
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

    lgdCode: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

blockSchema.index({ districtId: 1, name: 1 }, { unique: true });

export const Block = model("Block", blockSchema);

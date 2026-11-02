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

export const MaujaSchema = new Schema(
  {
    villageId: {
      type: Schema.Types.ObjectId,
      ref: "Village",
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

MaujaSchema.index(
  {
    villageId: 1,
    name: 1,
  },
  { unique: true },
);

export const Mauja = model("Mauja", MaujaSchema);

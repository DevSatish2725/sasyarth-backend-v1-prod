import { Schema, model } from "mongoose";
import { StateEntity } from "../location.types";

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

export const StateSchema = new Schema(
  {
    lgdCode: {
      type: Number,
      required: true,
      unique: true,
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

    code: {
      type: String,
      trim: true,
      uppercase: true,
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

StateSchema.index({ name: 1 }, { unique: true });

export const State = model<StateEntity>("State", StateSchema);

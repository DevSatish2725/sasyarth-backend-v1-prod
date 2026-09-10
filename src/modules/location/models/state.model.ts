import { Schema, model } from "mongoose";
import { StateEntity } from "../location.types";

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

StateSchema.index(
  { name: 1 },
  { unique: true },
);

export const State = model<StateEntity>("State", StateSchema);
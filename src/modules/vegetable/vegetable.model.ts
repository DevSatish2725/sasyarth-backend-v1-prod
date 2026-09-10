import { Schema, model } from "mongoose";
import { VEGETABLE_CATEGORIES, VEGETABLE_UNITS } from "./vegetable.constants";
import { VegetableEntity } from "./vegetable.types";

export const VegetableSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    displayNames: {
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

    category: {
      type: String,
      enum: Object.values(VEGETABLE_CATEGORIES),
      default: VEGETABLE_CATEGORIES.VEGETABLE,
      required: true,
    },

    defaultUnit: {
      type: String,
      enum: Object.values(VEGETABLE_UNITS),
      required: true,
    },

    allowedUnits: {
      type: [
        {
          type: String,
          enum: Object.values(VEGETABLE_UNITS),
        },
      ],
      required: true,
    },

    image: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Vegetable = model<VegetableEntity>("Vegetable", VegetableSchema);

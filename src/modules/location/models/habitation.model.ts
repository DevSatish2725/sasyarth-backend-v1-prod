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

const habitationSchema = new Schema(
  {
    maujaId: {
      type: Schema.Types.ObjectId,
      ref: "Mauja",
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

habitationSchema.index(
  {
    maujaId: 1,
    name: 1,
  },
  { unique: true },
);

export const Habitation = model("Habitation", habitationSchema);

import { Schema } from "mongoose";

export const GeoLocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,

      validate: {
        validator: (value: number[]) => {
          if (value.length !== 2) {
            return false;
          }

          const [longitude, latitude] = value;

          return (
            longitude !== undefined &&
            latitude !== undefined &&
            longitude >= -180 &&
            longitude <= 180 &&
            latitude >= -90 &&
            latitude <= 90
          );
        },

        message: "Coordinates must be [longitude, latitude]",
      },
    },
  },
  {
    _id: false,
  },
);

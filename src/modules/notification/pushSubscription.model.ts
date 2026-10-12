import { InferSchemaType, model, Schema } from "mongoose";

const PushSubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    endpoint: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    keys: {
      p256dh: {
        type: String,
        required: true,
      },

      auth: {
        type: String,
        required: true,
      },
    },

    userAgent: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PushSubscriptionSchema.index({
  userId: 1,
  isActive: 1,
});

export type PushSubscriptionEntity = InferSchemaType<
  typeof PushSubscriptionSchema
>;

export const PushSubscription = model(
  "PushSubscription",
  PushSubscriptionSchema,
);

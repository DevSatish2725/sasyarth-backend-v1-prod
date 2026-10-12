import { InferSchemaType, model, Schema } from "mongoose";

import { NOTIFICATION_REMINDER_TYPES } from "./notification.constants";

const NotificationReminderLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(NOTIFICATION_REMINDER_TYPES),
      required: true,
      index: true,
    },

    reminderKey: {
      type: String,
      required: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

NotificationReminderLogSchema.index(
  {
    userId: 1,
    type: 1,
    reminderKey: 1,
  },
  {
    unique: true,
  },
);

export type NotificationReminderLogEntity = InferSchemaType<
  typeof NotificationReminderLogSchema
>;

export const NotificationReminderLog = model(
  "NotificationReminderLog",
  NotificationReminderLogSchema,
);

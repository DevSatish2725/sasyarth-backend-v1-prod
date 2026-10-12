import { NOTIFICATION_REMINDER_TYPES } from "./notification.constants";

export type NotificationReminderType =
  (typeof NOTIFICATION_REMINDER_TYPES)[keyof typeof NOTIFICATION_REMINDER_TYPES];
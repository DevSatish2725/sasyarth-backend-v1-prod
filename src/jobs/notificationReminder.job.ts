import cron from "node-cron";

import {
  notificationReminderService,
} from "../modules/notification/notificationReminder.service";

import {
  logger,
} from "../config/logger";

export function startNotificationReminderJobs() {
  /**
   * =====================================
   * SELLER REMINDER
   *
   * Every day at 7:30 AM India time.
   * =====================================
   */
  cron.schedule(
    "30 7 * * *",
    async () => {
      try {
        logger.info(
          "Starting seller inventory reminder job",
        );

        const result =
          await notificationReminderService
            .sendSellerInventoryReminders();

        logger.info(
          {
            result,
          },
          "Seller inventory reminder job completed",
        );
      } catch (error) {
        logger.error(
          {
            error,
          },
          "Seller inventory reminder job failed",
        );
      }
    },
    {
      timezone:
        "Asia/Kolkata",
    },
  );

  /**
   * =====================================
   * BUYER REMINDER
   *
   * Run daily at 6 PM.
   *
   * The service itself uses a 3-day
   * reminder key, so the same buyer won't
   * receive it more than once in 3 days.
   * =====================================
   */
  cron.schedule(
    "0 18 * * *",
    async () => {
      try {
        logger.info(
          "Starting buyer seller-explore reminder job",
        );

        const result =
          await notificationReminderService
            .sendExploreSellerReminders();

        logger.info(
          {
            result,
          },
          "Buyer seller-explore reminder job completed",
        );
      } catch (error) {
        logger.error(
          {
            error,
          },
          "Buyer seller-explore reminder job failed",
        );
      }
    },
    {
      timezone:
        "Asia/Kolkata",
    },
  );

  logger.info(
    "Notification reminder jobs started",
  );
}
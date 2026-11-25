import { DailyInventory } from "../inventory/dailyInventory/dailyInventory.model";

import { Seller } from "../seller/seller.model";

import { User } from "../users/user.model";

import { getTodayBusinessDate } from "../../utils/businessDate";

import { PushSubscription } from "./pushSubscription.model";

import { pushService } from "./push.service";

import { NotificationReminderLog } from "./notificationReminderLog.model";

import { NOTIFICATION_REMINDER_TYPES } from "./notification.constants";

class NotificationReminderService {
  /**
   * Converts your business date into
   * YYYY-MM-DD for idempotency.
   */
  private getDateKey(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  /**
   * ========================================
   * SELLER DAILY INVENTORY REMINDER
   * ========================================
   */
  async sendSellerInventoryReminders() {
    const today = getTodayBusinessDate();

    const reminderKey = this.getDateKey(today);

    /**
     * Only active seller profiles.
     */
    const sellerProfiles = await Seller.find({
      sellerStatus: "ACTIVE",
    })
      .select({
        _id: 1,
        userId: 1,
      })
      .lean()
      .exec();

    if (!sellerProfiles.length) {
      return {
        checked: 0,
        sent: 0,
      };
    }

    const sellerProfileIds = sellerProfiles.map((seller) => seller._id);

    /**
     * Find sellers who already published
     * today's inventory.
     */
    const publishedSellerIds = await DailyInventory.distinct(
      "sellerProfileId",
      {
        sellerProfileId: {
          $in: sellerProfileIds,
        },

        businessDate: today,

        isPublished: true,
      },
    );

    const publishedSet = new Set(publishedSellerIds.map((id) => id.toString()));

    /**
     * Keep only sellers who have NOT
     * published today.
     */
    const sellersToRemind = sellerProfiles.filter(
      (seller) => !publishedSet.has(seller._id.toString()),
    );

    let sent = 0;

    for (const seller of sellersToRemind) {
      const userId = seller.userId;

      /**
       * Already reminded today?
       */
      const alreadySent = await NotificationReminderLog.exists({
        userId,

        type: NOTIFICATION_REMINDER_TYPES.SELLER_DAILY_INVENTORY,

        reminderKey,
      });

      if (alreadySent) {
        continue;
      }

      /**
       * Optional optimization:
       * don't call push service if user
       * has no active subscription.
       */
      const hasSubscription = await PushSubscription.exists({
        userId,
        isActive: true,
      });

      if (!hasSubscription) {
        continue;
      }

      const result = await pushService.sendToUser(userId, {
        title: "आज की सब्ज़ियों की जानकारी डालें",

        body: "अपनी आज की उपलब्ध सब्ज़ियाँ अपडेट करें, ताकि आसपास के खरीदार आपको ढूँढ सकें।",

        url: "/seller/inventory",

        tag: "seller-daily-inventory",
      });

      if (result.sent > 0) {
        await NotificationReminderLog.create({
          userId,

          type: NOTIFICATION_REMINDER_TYPES.SELLER_DAILY_INVENTORY,

          reminderKey,
        });

        sent++;
      }
    }

    return {
      checked: sellerProfiles.length,

      eligible: sellersToRemind.length,

      sent,
    };
  }

  /**
   * ========================================
   * BUYER EXPLORE SELLERS REMINDER
   * ========================================
   */
  async sendExploreSellerReminders() {
    const now = new Date();

    const bucket = Math.floor(now.getTime() / (3 * 24 * 60 * 60 * 1000));

    const reminderKey = `explore-sellers-${bucket}`;

    const users = await User.find({
      isPhoneVerified: true,
    })
      .select({
        _id: 1,
      })
      .lean()
      .exec();

    let sent = 0;

    for (const user of users) {
      const alreadySent = await NotificationReminderLog.exists({
        userId: user._id,
        type: NOTIFICATION_REMINDER_TYPES.EXPLORE_SELLERS_REMINDER,
        reminderKey,
      });

      if (alreadySent) {
        continue;
      }

      const hasSubscription = await PushSubscription.exists({
        userId: user._id,
        isActive: true,
      });

      if (!hasSubscription) {
        continue;
      }

      const result = await pushService.sendToUser(user._id, {
        title: "Sasyarth पर विक्रेताओं की खोज करें",

        body: "उपलब्ध विक्रेताओं से ताज़ी सब्ज़ियाँ खोजें।",

        url: "/sellers",

        tag: "explore-sellers",
      });

      if (result.sent > 0) {
        await NotificationReminderLog.create({
          userId: user._id,

          type: NOTIFICATION_REMINDER_TYPES.EXPLORE_SELLERS_REMINDER,

          reminderKey,
        });

        sent++;
      }
    }

    return {
      checked: users.length,
      sent,
    };
  }
}

export const notificationReminderService = new NotificationReminderService();

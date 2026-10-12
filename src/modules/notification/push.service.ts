import { Types } from "mongoose";

import { webpush } from "../../config/webPush";

import { PushSubscription } from "./pushSubscription.model";

export interface SavePushSubscriptionParams {
  userId: string | Types.ObjectId;

  endpoint: string;

  keys: {
    p256dh: string;
    auth: string;
  };

  userAgent?: string;
}

export interface SendPushPayload {
  title: string;

  body: string;

  url?: string;

  icon?: string;

  badge?: string;

  tag?: string;

  data?: Record<string, unknown>;
}

class PushService {
  /**
   * Save or update browser subscription.
   *
   * endpoint uniquely identifies a browser
   * push subscription.
   */
  async subscribe({
    userId,
    endpoint,
    keys,
    userAgent,
  }: SavePushSubscriptionParams) {
    return PushSubscription.findOneAndUpdate(
      {
        endpoint,
      },

      {
        $set: {
          userId: new Types.ObjectId(userId.toString()),

          endpoint,

          keys: {
            p256dh: keys.p256dh,

            auth: keys.auth,
          },

          userAgent: userAgent ?? null,

          isActive: true,
        },
      },

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    )
      .lean()
      .exec();
  }

  /**
   * Disable one specific browser/device
   * subscription.
   */
  async unsubscribe({
    userId,
    endpoint,
  }: {
    userId: string | Types.ObjectId;
    endpoint: string;
  }) {
    return PushSubscription.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId.toString()),

        endpoint,
      },

      {
        $set: {
          isActive: false,
        },
      },

      {
        new: true,
      },
    )
      .lean()
      .exec();
  }

  /**
   * Remove all push subscriptions
   * belonging to a user.
   *
   * Useful if you eventually add
   * "Disable notifications everywhere".
   */
  async unsubscribeAll(userId: string | Types.ObjectId) {
    return PushSubscription.updateMany(
      {
        userId: new Types.ObjectId(userId.toString()),

        isActive: true,
      },

      {
        $set: {
          isActive: false,
        },
      },
    );
  }

  /**
   * Send push notification to all active
   * devices/browsers belonging to the user.
   */
  async sendToUser(userId: string | Types.ObjectId, payload: SendPushPayload) {
    const subscriptions = await PushSubscription.find({
      userId: new Types.ObjectId(userId.toString()),

      isActive: true,
    })
      .lean()
      .exec();

    if (!subscriptions.length) {
      return {
        sent: 0,
        failed: 0,
      };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,

      body: payload.body,

      url: payload.url ?? "/",

      icon: payload.icon ?? "/icons/icon-192x192.png",

      badge: payload.badge ?? "/icons/icon-192x192.png",

      tag: payload.tag,

      data: payload.data ?? {},
    });

    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,

              keys: {
                p256dh: subscription.keys!.p256dh,

                auth: subscription.keys!.auth,
              },
            },

            notificationPayload,
          );

          sent++;

          await PushSubscription.updateOne(
            {
              _id: subscription._id,
            },

            {
              $set: {
                lastUsedAt: new Date(),
              },
            },
          ).exec();
        } catch (error: unknown) {
          failed++;

          const statusCode = this.getWebPushStatusCode(error);

          /**
           * 404 / 410 means browser push
           * subscription is no longer valid.
           *
           * User may have:
           * - removed app
           * - cleared browser data
           * - revoked notification permission
           * - browser rotated subscription
           */
          if (statusCode === 404 || statusCode === 410) {
            await PushSubscription.updateOne(
              {
                _id: subscription._id,
              },

              {
                $set: {
                  isActive: false,
                },
              },
            ).exec();

            return;
          }

          console.error("Push notification failed", {
            subscriptionId: subscription._id,

            statusCode,

            error,
          });
        }
      }),
    );

    return {
      sent,
      failed,
    };
  }

  /**
   * Send push to multiple users.
   *
   * Useful later when a farmer publishes
   * tomatoes and several buyers are
   * interested.
   */
  async sendToUsers(
    userIds: (string | Types.ObjectId)[],
    payload: SendPushPayload,
  ) {
    const uniqueUserIds = [
      ...new Set(userIds.map((userId) => userId.toString())),
    ];

    return Promise.allSettled(
      uniqueUserIds.map((userId) => this.sendToUser(userId, payload)),
    );
  }

  private getWebPushStatusCode(error: unknown): number | undefined {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof (
        error as {
          statusCode?: unknown;
        }
      ).statusCode === "number"
    ) {
      return (
        error as {
          statusCode: number;
        }
      ).statusCode;
    }

    return undefined;
  }

  async isSubscribed({
    userId,
    endpoint,
  }: {
    userId: string | Types.ObjectId;
    endpoint: string;
  }) {
    const subscription = await PushSubscription.exists({
      userId: new Types.ObjectId(userId.toString()),

      endpoint,

      isActive: true,
    });

    return Boolean(subscription);
  }
}

export const pushService = new PushService();

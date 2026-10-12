import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ApiError } from "../../utils/ApiError";

import { pushService } from "./push.service";

interface SubscribePushBody {
  endpoint?: string;

  keys?: {
    p256dh?: string;
    auth?: string;
  };
}

interface UnsubscribePushBody {
  endpoint?: string;
}

class PushController {
  subscribe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "UNAUTHORIZED");
    }

    const { endpoint, keys } = req.body as SubscribePushBody;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      throw new ApiError(400, "INVALID_PUSH_SUBSCRIPTION");
    }

    const userAgent = req.headers["user-agent"];

    const subscription = await pushService.subscribe({
      userId,
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      ...(userAgent
        ? {
            userAgent,
          }
        : {}),
    });
    sendResponse(res, {
      statusCode: 200,

      message: "PUSH_SUBSCRIPTION_SAVED",

      data: {
        id: subscription?._id,

        isActive: subscription?.isActive,
      },
    });
  });

  unsubscribe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "UNAUTHORIZED");
    }

    const { endpoint } = req.body as UnsubscribePushBody;

    if (!endpoint) {
      throw new ApiError(400, "PUSH_ENDPOINT_REQUIRED");
    }

    await pushService.unsubscribe({
      userId,
      endpoint,
    });

    sendResponse(res, {
      statusCode: 200,

      message: "PUSH_SUBSCRIPTION_REMOVED",

      data: null,
    });
  });

  unsubscribeAll = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "UNAUTHORIZED");
    }

    await pushService.unsubscribeAll(userId);

    sendResponse(res, {
      statusCode: 200,

      message: "PUSH_SUBSCRIPTIONS_REMOVED",

      data: null,
    });
  });

  status = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "UNAUTHORIZED");
    }

    const { endpoint } = req.body as {
      endpoint?: string;
    };

    if (!endpoint) {
      throw new ApiError(400, "PUSH_ENDPOINT_REQUIRED");
    }

    const subscribed = await pushService.isSubscribed({
      userId,
      endpoint,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "PUSH_STATUS_FETCHED",
      data: {
        subscribed,
      },
    });
  });
}

export const pushController = new PushController();

import { Router } from "express";

import { pushController } from "./push.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { pushService } from "./push.service";
import { sendResponse } from "../../utils/sendResponse";
import { notificationReminderService } from "./notificationReminder.service";

const pushRouter = Router();

/**
 * POST
 * /api/v1/push/subscribe
 */
pushRouter.post("/subscribe", requireAuth, pushController.subscribe);

/**
 * DELETE
 * /api/v1/push/unsubscribe
 */
pushRouter.delete("/unsubscribe", requireAuth, pushController.unsubscribe);

/**
 * DELETE
 * /api/v1/push/unsubscribe-all
 */
pushRouter.delete(
  "/unsubscribe-all",
  requireAuth,
  pushController.unsubscribeAll,
);

// pushRouter.post(
//   "/test",
//   requireAuth,
//   catchAsync(async (req, res) => {
//     await pushService.sendToUser(req.user!.userId, {
//       title: "Sasyarth Test",
//       body: "Push notification is working.",
//       url: "/sellers",
//     });

//     sendResponse(res, {
//       statusCode: 200,
//       message: "TEST_NOTIFICATION_SENT",
//       data: null,
//     });
//   }),
// );

pushRouter.post(
  "/test",
  requireAuth,
  catchAsync(async (req, res) => {
    const result = await pushService.sendToUser(
      req.user!.userId,
      {
        title: "Sasyarth Test",
        body: "Push notification is working.",
        url: "/sellers",
      },
    );

    // Print actual push delivery result in backend terminal.
    console.log("Push delivery result:", result);

    sendResponse(res, {
      statusCode: 200,
      message: "TEST_NOTIFICATION_COMPLETED",
      data: result,
    });
  }),
);

pushRouter.post(
  "/test-reminders",
  requireAuth,
  catchAsync(async (_req, res) => {
    const sellerResult =
      await notificationReminderService.sendSellerInventoryReminders();

    const exploreResult =
      await notificationReminderService.sendExploreSellerReminders();

    sendResponse(res, {
      statusCode: 200,
      message: "REMINDER_TEST_COMPLETED",
      data: {
        sellerResult,
        exploreResult,
      },
    });
  }),
);

pushRouter.post(
  "/status",
  requireAuth,
  pushController.status,
);

export default pushRouter;

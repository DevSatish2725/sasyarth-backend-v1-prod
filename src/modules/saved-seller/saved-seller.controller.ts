import { Types } from "mongoose";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { savedSellerService } from "./saved-seller.service";

class SavedSellerController {
  saveSeller = catchAsync(async (req, res) => {
    const buyerId = new Types.ObjectId(req.user!.userId);

    const sellerProfileId = new Types.ObjectId(
      req.params.sellerProfileId as string,
    );

    await savedSellerService.saveSeller(buyerId, sellerProfileId);

    sendResponse(res, {
      statusCode: 201,
      message: "Seller saved successfully.",
      data: null,
    });
  });

  removeSavedSeller = catchAsync(async (req, res) => {
    const buyerId = new Types.ObjectId(req.user!.userId);

    const sellerProfileId = new Types.ObjectId(
      req.params.sellerProfileId as string,
    );

    const result = await savedSellerService.removeSavedSeller(
      buyerId,
      sellerProfileId,
    );

    sendResponse(res, {
      statusCode: 200,
      message: "Seller removed from saved sellers.",
      data: result,
    });
  });

  getSavedSellers = catchAsync(async (req, res) => {
    const buyerId = new Types.ObjectId(req.user!.userId);

    const sellers = await savedSellerService.getSavedSellers(buyerId);

    sendResponse(res, {
      statusCode: 200,
      message: "Saved sellers fetched successfully.",
      data: sellers,
    });
  });
}

export const savedSellerController = new SavedSellerController();

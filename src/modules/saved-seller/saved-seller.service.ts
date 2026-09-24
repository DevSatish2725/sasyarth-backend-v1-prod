import { Types } from "mongoose";
import { ApiError } from "../../utils/ApiError";
import { savedSellerRepository } from "./saved-seller.repository";
import { sellerRepository } from "../seller/seller.repository";
import { mapSavedSellerListItem } from "./saved-seller.mapper";
import { getTodayBusinessDate } from "../../utils/businessDate";

class SavedSellerService {
  async saveSeller(buyerId: Types.ObjectId, sellerProfileId: Types.ObjectId) {
    const seller = await sellerRepository.findById(sellerProfileId.toString());

    if (!seller) {
      throw new ApiError(404, "Seller doesn't exist.");
    }

    // Prevent seller from saving their own profile.
    if (seller.userId.equals(buyerId)) {
      throw new ApiError(403, "You cannot save your own seller profile.");
    }

    const existing = await savedSellerRepository.findOne(
      buyerId,
      sellerProfileId,
    );

    if (existing) {
      throw new ApiError(409, "Seller is already saved.");
    }

    return savedSellerRepository.create(buyerId, sellerProfileId);
  }

  async removeSavedSeller(
    buyerId: Types.ObjectId,
    sellerProfileId: Types.ObjectId,
  ) {
    const deleted = await savedSellerRepository.deleteOne(
      buyerId,
      sellerProfileId,
    );

    if (!deleted) {
      throw new ApiError(404, "Saved seller doesn't exist.");
    }

    return {
      sellerProfileId: sellerProfileId.toString(),
    };
  }

  async getSavedSellers(buyerId: Types.ObjectId) {
    const today = getTodayBusinessDate();
    const savedSellers = await savedSellerRepository.findBuyerSavedSellers(
      buyerId,
      today,
    );

    return savedSellers.map(mapSavedSellerListItem);
  }
}

export const savedSellerService = new SavedSellerService();

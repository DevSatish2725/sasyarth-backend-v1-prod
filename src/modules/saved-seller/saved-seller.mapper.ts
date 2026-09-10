import { SavedSellerListEntity } from "./saved-seller.types";

export const mapSavedSellerListItem = (savedSeller: SavedSellerListEntity) => ({
  savedSellerId: savedSeller._id.toString(),

  sellerProfileId: savedSeller.sellerProfileId.toString(),

  name: savedSeller.seller.fullName,

  ...(savedSeller.seller.location
    ? {
        location: savedSeller.seller.location,
      }
    : {}),

  savedAt: savedSeller.savedAt,
});

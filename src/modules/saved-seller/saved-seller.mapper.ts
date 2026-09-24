import { SavedSellerListEntity } from "./saved-seller.types";

export const mapSavedSellerListItem = (
  savedSeller: SavedSellerListEntity,
) => ({
  savedSellerId:
    savedSeller._id.toString(),

  sellerProfileId:
    savedSeller.sellerProfileId.toString(),

  name:
    savedSeller.seller.fullName,

  location:
    savedSeller.seller.location,

  verificationStatus:
    savedSeller.seller.verificationStatus,

  availabilityStatus:
    savedSeller.availabilityStatus,

  averageRating:
    savedSeller.seller.averageRating,

  ratingCount:
    savedSeller.seller.ratingCount,

  availableVegetables:
    savedSeller.availableVegetables.map(
      (vegetable) => ({
        id: vegetable.id.toString(),
        name: vegetable.name,
      }),
    ),

  savedAt:
    savedSeller.savedAt,
});

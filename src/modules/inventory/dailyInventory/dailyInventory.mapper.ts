import { Types } from "mongoose";
import {
  SellerDocument,
  SellerWithUserEntity,
} from "../../seller/seller.types";
import {
  DailyInventoryDocument,
  PopulatedUser,
  PopulatedVegetable,
  SellerShopItem,
  SellerShopResponse,
} from "./dailyInventory.types";

export const sellerShop = (
  seller: SellerWithUserEntity,
  inventory: DailyInventoryDocument,
  reputation: {
    totalRatings: number;
    averageRating: number;
    completedDeals: number;
  },
  isSaved: boolean,
  shopOwner: boolean,
): SellerShopResponse => {
  const user = seller.userId as unknown as PopulatedUser;

  const items: SellerShopItem[] = inventory.items
    .filter((item) => item.availableQty > 0)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((item) => {
      const vegetable = item.vegetableId as unknown as PopulatedVegetable;

      return {
        itemId: item._id.toString(),

        vegetableId: vegetable._id.toString(),

        vegetableName: vegetable.name,

        imageUrl: vegetable.imageUrl,

        displayNames: vegetable.displayNames,
        searchAliases: vegetable.searchAliases,

        unit: item.unit,

        availableQty: item.availableQty,

        sellerPrice: item.sellerPrice,

        isNegotiable: item.isNegotiable,

        displayOrder: item.displayOrder ?? 0,

        ...(item.imageOverride !== undefined && {
          imageOverride: item.imageOverride,
        }),
      };
    });

  return {
    seller: {
      id: seller._id.toString(),
      name: user.fullName,
      location: user.location,
      reputation: {
        averageRating: reputation.averageRating,
        completedDeals: reputation.completedDeals,
      },
      isSaved,
      shopOwner,
    },

    inventory: {
      id: inventory._id.toString(),
      date: inventory.inventoryDate,
      items,
    },
  };
};

import { VEGETABLE_UNITS } from "../../vegetable/vegetable.constants";
import { MODE, STATUS } from "./dailyInventory.constants";
import { HydratedDocument, InferSchemaType, Types } from "mongoose";
import { DailyInventorySchema } from "./dailyInventory.model";
import { VegetableEntity } from "../../vegetable/vegetable.types";

export type StatusType = (typeof STATUS)[keyof typeof STATUS];

export type UnitType = (typeof VEGETABLE_UNITS)[keyof typeof VEGETABLE_UNITS];

export type ModeType = (typeof MODE)[keyof typeof MODE];

export type DailyInventoryEntity = InferSchemaType<typeof DailyInventorySchema>;

export type DailyInventoryDocument = HydratedDocument<DailyInventoryEntity>;

export type DailyInventoryItem = DailyInventoryEntity["items"][number];

export interface InventoryItemData {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  committedQty: number;
  marketPrice: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string | null;
}

export interface CreateInventoryItemPayload {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  committedQty: number;
  marketPrice: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string;
}

export interface CreateInventoryPayload {
  sellerProfileId: Types.ObjectId;
  status: StatusType;
  inventoryDate: Date;
  items: CreateInventoryItemPayload[];
}

export interface PopulatedVegetable {
  _id: string;
  name: string;
  imageUrl: string;
  displayNames: {
    en: string;
    hi: string;
  };
  searchAliases: string[];
}
export interface PopulatedInventoryItem {
  _id: Types.ObjectId;

  vegetableId: PopulatedVegetable;

  unit: UnitType;

  availableQty: number;

  committedQty: number;

  marketPrice: number;

  sellerPrice: number;

  isNegotiable: boolean;

  displayOrder: number;

  imageOverride?: string | null;
}

export interface PopulatedInventory {
  _id: Types.ObjectId;

  sellerProfileId: Types.ObjectId;

  status: StatusType;

  inventoryDate: Date;

  items: PopulatedInventoryItem[];

  createdAt: Date;

  updatedAt: Date;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  fullName: string;
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
}
export interface SellerShopItem {
  itemId: string | Types.ObjectId;
  vegetableId: string;
  vegetableName: string;
  unit: UnitType;
  availableQty: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string | null;
}

export interface SellerShopResponse {
  seller: {
    id: string;
    name: string;
    location: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    };
    reputation: {
      averageRating: number;
      completedDeals: number;
    };
    isSaved: boolean;
    shopOwner: boolean;
  };

  inventory: {
    id: string;
    date: Date;
    items: SellerShopItem[];
  };
}

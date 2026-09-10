import { Types } from "mongoose";
import { DailyInventoryItem, UnitType } from "./dailyInventory.types";

export interface CreateInventoryItemDto {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  marketPrice: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string;
}

export interface CreateInventoryDto {
  items?: CreateInventoryItemDto[];
}

export interface UpdateInventoryItemDto {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  marketPrice: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string;
}

export interface UpdateInventoryDto {
  items: UpdateInventoryItemDto[];
}

export interface PublilshInventoryDto {
  items: DailyInventoryItem[];
}

export interface UpdatePublishedInventoryItemDto {
  itemId: string;
  availableQty?: number;
  marketPrice?: number;
  sellerPrice?: number;
  isNegotiable?: boolean;
  displayOrder?: number;
  imageOverride?: string;
}

export interface UpdatePublishedInventoryDto {
  items: UpdatePublishedInventoryItemDto[];
}

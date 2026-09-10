import { model, Schema } from "mongoose";
import { STATUS } from "./dailyInventory.constants";
import { VEGETABLE_UNITS } from "../../vegetable/vegetable.constants";
import { DailyInventoryEntity } from "./dailyInventory.types";

const DailyInventoryItemSchema = new Schema({
  vegetableId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Vegetable",
  },
  unit: {
    type: String,
    enum: Object.values(VEGETABLE_UNITS),
    required: true,
  },
  availableQty: {
    type: Number,
    required: true,
  },
  committedQty: {
    type: Number,
    default: 0,
  },
  marketPrice: {
    type: Number,
    required: true,
  },
  sellerPrice: {
    type: Number,
    required: true,
  },
  isNegotiable: {
    type: Boolean,
    required: true,
    default: false,
  },
  displayOrder: {
    type: Number,
    // required: true,
  },
  imageOverride: {
    type: String,
  },
});

export const DailyInventorySchema = new Schema(
  {
    sellerProfileId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      required: true,
      default: STATUS.DRAFT,
    },
    inventoryDate: {
      type: Date,
      required: true,
      // unique: true,
    },
    items: {
      type: [DailyInventoryItemSchema],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

DailyInventorySchema.index(
  {
    sellerProfileId: 1,
    inventoryDate: 1,
  },
  {
    unique: true,
  },
);

export const DailyInventory = model<DailyInventoryEntity>(
  "DailyInventory",
  DailyInventorySchema,
);

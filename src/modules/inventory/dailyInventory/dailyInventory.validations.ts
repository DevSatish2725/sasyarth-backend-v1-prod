import { z } from "zod";
import { VEGETABLE_UNITS } from "../../vegetable/vegetable.constants";
import { MODE } from "./dailyInventory.constants";

const inventoryItemSchema = z.object({
  vegetableId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid vegetable ID."),

  unit: z.enum(
    Object.values(VEGETABLE_UNITS) as [
      (typeof VEGETABLE_UNITS)[keyof typeof VEGETABLE_UNITS],
      ...(typeof VEGETABLE_UNITS)[keyof typeof VEGETABLE_UNITS][],
    ],
  ),

  availableQty: z.number().min(0, "Available quantity cannot be negative."),

  marketPrice: z.number().min(0, "Market price cannot be negative."),

  sellerPrice: z.number().min(0, "Seller price cannot be negative."),

  isNegotiable: z.boolean().optional(),

  displayOrder: z
    .number()
    .int()
    .min(0, "Display order is not valid.")
    .optional(),

  imageOverride: z.string().optional(),
});

export const inventorySchemaId = {
  params: z.object({
    inventoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid inventory id.."),
  }),
};

const inventoryItemsSchema = z
  .array(inventoryItemSchema)
  .refine(
    (items) => {
      const vegetableIds = items.map(
        (item) => item.vegetableId,
      );

      return (
        new Set(vegetableIds).size ===
        vegetableIds.length
      );
    },
    {
      message:
        "Duplicate vegetables are not allowed.",
    },
  );

export const createDraftInventorySchema = {
  body: z
    .object({
      items:
        inventoryItemsSchema.optional(),
    })
    .default({}),

  params: z.object({
    mode: z.enum(
      Object.values(MODE) as [
        string,
        ...string[],
      ],
    ),
  }),
};

export const updateDraftInventorySchema = {
  body: z.object({
    items: z
      .array(inventoryItemSchema)
      .optional()
      .refine(
        (data) => {
          if (!data) return;
          const vegetableIds = data.map((item) => item.vegetableId);
          return new Set(vegetableIds).size === vegetableIds.length;
        },
        {
          message: "Duplicate vegetables are not allowed.",
        },
      ),
  }),
  params: z.object({
    inventoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid inventory id.."),
  }),
};

export const createPublishInventorySchema = {
  body: z.object({
    items: z
      .array(
        inventoryItemSchema.extend({
          availableQty: z
            .number()
            .positive("Available quantity must be greater than 0."),

          marketPrice: z
            .number()
            .positive("Market price must be greater than 0."),

          sellerPrice: z
            .number()
            .positive("Seller price must be greater than 0."),
        }),
      )
      .refine(
        (data) => {
          const vegetableIds = data.map((vegetable) => vegetable.vegetableId);
          return new Set(vegetableIds).size === vegetableIds.length;
        },
        { message: "Duplicate entries are not allowed." },
      ),
  }),
};

const updatePublishedInventoryItemSchema = z
  .object({
    itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid inventory item ID."),

    availableQty: z
      .number()
      .positive("Available quantity must be more than 0.")
      .optional(),

    marketPrice: z
      .number()
      .positive("Market price must be more than 0.")
      .optional(),

    sellerPrice: z
      .number()
      .positive("Seller price must be more than 0.")
      .optional(),

    isNegotiable: z.boolean().optional(),

    displayOrder: z.number().int().min(0).optional(),

    imageOverride: z.string().optional(),
    committedQty: z
      .never({
        error: "committedQty cannot be updated manually.",
      })
      .optional(),
  })
  .strict()
  .refine(
    (item) =>
      item.availableQty !== undefined ||
      item.marketPrice !== undefined ||
      item.sellerPrice !== undefined ||
      item.isNegotiable !== undefined ||
      item.displayOrder !== undefined ||
      item.imageOverride !== undefined,
    {
      message: "At least one field must be updated.",
    },
  );

export const updatePublishedInventorySchema = {
  body: z.object({
    items: z
      .array(updatePublishedInventoryItemSchema)
      .min(1, "At least one item is required."),
  }),
  params: z.object({
    inventoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid inventory id.."),
  }),
};

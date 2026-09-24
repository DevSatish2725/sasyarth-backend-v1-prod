// src/modules/contact-interaction/contactInteraction.model.ts

import { Schema, model, Types } from "mongoose";
import { IContactInteraction } from "./contactInteraction.types";
import { CONTACT_INTERACTION_TYPE } from "./contactInteraction.constants";

const contactInteractionSchema = new Schema<IContactInteraction>(
  {
    buyerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "SellerProfile",
      required: true,
      index: true,
    },

    interactionType: {
      type: String,
      enum: Object.values(CONTACT_INTERACTION_TYPE),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

contactInteractionSchema.index({
  buyerUserId: 1,
  sellerProfileId: 1,
  createdAt: -1,
});

export const ContactInteractionModel = model<IContactInteraction>(
  "ContactInteraction",
  contactInteractionSchema,
);

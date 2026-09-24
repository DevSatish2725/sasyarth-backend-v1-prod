import { Types } from "mongoose";
import { CONTACT_INTERACTION_TYPE } from "./contactInteraction.constants";

export type ContactInteractionType =
  (typeof CONTACT_INTERACTION_TYPE)[keyof typeof CONTACT_INTERACTION_TYPE];

export interface IContactInteraction {
  buyerUserId: Types.ObjectId;
  sellerProfileId: Types.ObjectId;
  interactionType: ContactInteractionType;
  createdAt: Date;
  updatedAt: Date;
}

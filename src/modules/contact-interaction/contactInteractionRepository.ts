// contactInteraction.repository.ts

import { Types } from "mongoose";

import { ContactInteractionModel } from "./contactInteraction.model";
import { CONTACT_INTERACTION_TYPE } from "./contactInteraction.constants";

class ContactInteractionRepository {
  createViewContactInteraction({
    buyerUserId,
    sellerProfileId,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
  }) {
    return ContactInteractionModel.create({
      buyerUserId: new Types.ObjectId(buyerUserId),
      sellerProfileId: new Types.ObjectId(sellerProfileId),
      interactionType: CONTACT_INTERACTION_TYPE.VIEW_CONTACT,
    });
  }

  findLatestInteraction({
    buyerUserId,
    sellerProfileId,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
  }) {
    return ContactInteractionModel.findOne({
      buyerUserId: new Types.ObjectId(buyerUserId),

      sellerProfileId: new Types.ObjectId(sellerProfileId),
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  findRecentInteraction({
    buyerUserId,
    sellerProfileId,
    since,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
    since: Date;
  }) {
    return ContactInteractionModel.findOne({
      buyerUserId: new Types.ObjectId(buyerUserId),

      sellerProfileId: new Types.ObjectId(sellerProfileId),

      createdAt: {
        $gte: since,
      },
    }).lean();
  }
}

export const contactInteractionRepository = new ContactInteractionRepository();

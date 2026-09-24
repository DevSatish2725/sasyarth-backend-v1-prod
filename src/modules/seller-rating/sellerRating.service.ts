import { ApiError } from "../../utils/ApiError";
import { contactInteractionRepository } from "../contact-interaction/contactInteractionRepository";
import { sellerRepository } from "../seller/seller.repository";
import { RATING_ELIGIBILITY_REASON } from "./sellerRating.constants";
import { sellerRatingRepository } from "./sellerRating.repository";
import {
  MySellerRatingStatus,
  SellerRatingSummary,
  SellerRatingTag,
  UpdateSellerRatingPayload,
} from "./sellerRating.types";

class SellerRatingService {
  async create({
    buyerUserId,
    sellerProfileId,
    rating,
    tags,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
    rating: number;
    tags: SellerRatingTag[];
  }) {
    const existingRating = await sellerRatingRepository.findByBuyerAndSeller({
      buyerUserId,
      sellerProfileId,
    });

    if (existingRating) {
      throw new ApiError(409, "You have already rated this seller.");
    }

    const interaction =
      await contactInteractionRepository.findLatestInteraction({
        buyerUserId,
        sellerProfileId,
      });

    if (!interaction) {
      throw new ApiError(
        403,
        "You can rate this seller only after contacting them.",
      );
    }

    const eligibleAt = new Date(
      interaction.createdAt.getTime() + 1 * 60 * 1000,
    );

    if (Date.now() < eligibleAt.getTime()) {
      throw new ApiError(403, "You can rate this seller after some time.");
    }

    return sellerRatingRepository.create({
      buyerUserId,
      sellerProfileId,
      rating,
      tags,
      contactInteractionId: interaction._id.toString(),
    });
  }

  async getMySellerRatingStatus({
    buyerUserId,
    sellerProfileId,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
  }): Promise<MySellerRatingStatus> {
    const seller = await sellerRepository.findById(sellerProfileId);

    if (!seller) {
      throw new ApiError(404, "Seller not found.");
    }
    const existingRating = await sellerRatingRepository.findByBuyerAndSeller({
      buyerUserId,
      sellerProfileId,
    });

    if (existingRating) {
      return {
        hasRated: true,
        canRate: true,
        eligibleAt: null,

        rating: {
          _id: existingRating._id.toString(),
          rating: existingRating.rating,
          tags: existingRating.tags,
          createdAt: existingRating.createdAt,
          updatedAt: existingRating.updatedAt,
        },
      };
    }

    const interaction =
      await contactInteractionRepository.findLatestInteraction({
        buyerUserId,
        sellerProfileId,
      });

    if (!interaction) {
      return {
        hasRated: false,
        canRate: false,
        eligibleAt: null,
        reason: RATING_ELIGIBILITY_REASON.CONTACT_REQUIRED,
        rating: null,
      };
    }

    const eligibleAt = new Date(
      interaction.createdAt.getTime() + 1 * 60 * 1000,
    );

    if (new Date() < eligibleAt) {
      return {
        hasRated: false,
        canRate: false,
        eligibleAt,
        reason: RATING_ELIGIBILITY_REASON.WAITING_PERIOD,
        rating: null,
      };
    }

    return {
      hasRated: false,
      canRate: true,
      eligibleAt,
      rating: null,
    };
  }

  async getSellerRatingSummary(
    sellerProfileId: string,
  ): Promise<SellerRatingSummary> {
    const result =
      await sellerRatingRepository.getRatingSummary(sellerProfileId);

    const ratingSummary = result?.ratingSummary?.[0];

    const tagCounts = Object.fromEntries(
      (result?.tagSummary ?? []).map((item) => [item._id, item.count]),
    );

    return {
      averageRating: ratingSummary
        ? Number(ratingSummary.averageRating.toFixed(1))
        : 0,

      ratingCount: ratingSummary?.ratingCount ?? 0,

      tagCounts,
    };
  }

  async updateSellerRating({
    buyerUserId,
    sellerProfileId,
    payload,
  }: {
    buyerUserId: string;
    sellerProfileId: string;
    payload: UpdateSellerRatingPayload;
  }) {
    const existingRating = await sellerRatingRepository.findByBuyerAndSeller({
      buyerUserId,
      sellerProfileId,
    });

    if (!existingRating) {
      throw new ApiError(404, "You have not rated this seller yet.");
    }

    const updatePayload: UpdateSellerRatingPayload = {
      ...(payload.rating !== undefined ? { rating: payload.rating } : {}),

      ...(payload.tags !== undefined ? { tags: payload.tags } : {}),
    };

    const updatedRating = await sellerRatingRepository.updateByBuyerAndSeller({
      buyerUserId,
      sellerProfileId,
      payload: updatePayload,
    });

    return updatedRating;
  }
}

export const sellerRatingService = new SellerRatingService();

import { Types } from "mongoose";
import { ApiError } from "../../utils/ApiError";
import {
  DEFAULT_LIMIT,
  DEFAULT_RADIUS_KM,
  MAX_LIMIT,
  SELLER_MESSAGES,
  SELLER_STATUS,
  SELLER_VERIFICATION_STATUS,
} from "./seller.constants";
import { applySellerDto, reApplySellerDto } from "./seller.dto";
import { sellerRepository } from "./seller.repository";
import { toCallSellerDetails, toSellerProfileDto } from "./seller.mapper";
import {
  GetSellerListingParams,
  SellerListingCursor,
  SellerVerificationStatus,
} from "./seller.types";
import { toAdminSellerDto, toAdminSellerListDto } from "../admin/admin.mapper";
import { getTodayBusinessDate } from "../../utils/businessDate";
import { User } from "../users/user.model";
import { sellerPipeline } from "./seller.pipeline";
import { logger } from "../../config/logger";
import { locationRepository } from "../location/location.repository";

class SellerService {
  private encodeCursor(cursor: SellerListingCursor): string {
    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
  }

  private decodeCursor(cursor: string): SellerListingCursor {
    try {
      const decoded = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf-8"),
      );

      if (
        typeof decoded.distanceMeters !== "number" ||
        typeof decoded.sellerId !== "string"
      ) {
        throw new ApiError(400, "Invalid cursor");
      }

      return decoded;
    } catch {
      throw new ApiError(400, "Invalid pagination cursor");
    }
  }
  async apply(userId: string, payload: applySellerDto) {
    const seller = await sellerRepository.findByUserId(userId);
    if (seller) {
      throw new ApiError(429, SELLER_MESSAGES.REQUEST_ALREADY_SENT);
    }

    const createPayload: applySellerDto = {
      userId: new Types.ObjectId(userId),
      businessType: payload.businessType,
      verificationStatus: SELLER_VERIFICATION_STATUS.PENDING,
      documents: payload.documents,
    };

    const newSeller = await sellerRepository.create(createPayload);
    return toSellerProfileDto(newSeller);
  }

  async me(userId: string) {
    const seller = await sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new ApiError(404, SELLER_MESSAGES.SELLER_PROFILE_NOT_EXIST);
    }
    return toSellerProfileDto(seller);
  }

  async reApply(userId: string, payload: reApplySellerDto) {
    const seller = await sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new ApiError(404, SELLER_MESSAGES.SELLER_PROFILE_NOT_EXIST);
    }
    switch (seller.verificationStatus) {
      case SELLER_VERIFICATION_STATUS.VERIFIED:
        throw new ApiError(409, SELLER_MESSAGES.REQUEST_VERIFIED);
      case SELLER_VERIFICATION_STATUS.PENDING:
        throw new ApiError(409, SELLER_MESSAGES.REQUEST_REVIEW);
      case SELLER_VERIFICATION_STATUS.REJECTED:
        if (payload.businessType) {
          seller.businessType = payload.businessType;
        }
        if (payload.documents) {
          for (const newDoc of payload.documents) {
            const existingDoc = seller.documents.find(
              (doc) => doc.type === newDoc.type,
            );

            if (existingDoc) {
              existingDoc.url = newDoc.url;
              existingDoc.uploadedAt = new Date();
            } else {
              seller.documents.push(newDoc);
            }
          }
        }
        seller.verificationStatus = SELLER_VERIFICATION_STATUS.PENDING;
        seller.reviewedAt = null;
        seller.reviewedBy = null;
        seller.rejectionReason = null;

        await seller.save();

        return toSellerProfileDto(seller);
    }
  }

  async adminList(status: SellerVerificationStatus) {
    const sellers = await sellerRepository.findByVerificationStatus(status);
    if (!sellers) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }
    return sellers.map(toAdminSellerListDto);
  }

  async adminDetails(sellerId: string) {
    const seller = await sellerRepository.findByIdWithPersonalDetails(sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }
    return toAdminSellerListDto(seller);
  }

  async approve(sellerId: string, adminId: string) {
    const seller = await sellerRepository.findById(sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }

    if (seller.verificationStatus === SELLER_VERIFICATION_STATUS.VERIFIED) {
      throw new ApiError(409, SELLER_MESSAGES.REQUEST_VERIFIED);
    }

    if (seller.verificationStatus === SELLER_VERIFICATION_STATUS.REJECTED) {
      throw new ApiError(409, SELLER_MESSAGES.REQUEST_REJECTED);
    }

    seller.verificationStatus = SELLER_VERIFICATION_STATUS.VERIFIED;

    seller.reviewedBy = new Types.ObjectId(adminId);
    seller.reviewedAt = new Date();
    seller.rejectionReason = null;

    await seller.save();

    return toAdminSellerDto(seller);
  }

  async reject(sellerId: string, adminId: string, rejectionReason: string) {
    const seller = await sellerRepository.findById(sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }

    if (seller.verificationStatus === SELLER_VERIFICATION_STATUS.VERIFIED) {
      throw new ApiError(
        409,
        `${SELLER_MESSAGES.REQUEST_VERIFIED} It can't reject.`,
      );
    }

    if (seller.verificationStatus === SELLER_VERIFICATION_STATUS.REJECTED) {
      throw new ApiError(
        409,
        `${SELLER_MESSAGES.REQUEST_REJECTED}It can't reject again.`,
      );
    }

    seller.verificationStatus = SELLER_VERIFICATION_STATUS.REJECTED;

    seller.rejectionReason = rejectionReason;
    seller.reviewedBy = new Types.ObjectId(adminId);
    seller.reviewedAt = new Date();

    await seller.save();

    return toAdminSellerDto(seller);
  }
  async block(sellerId: string, adminId: string, blockReason: string) {
    const seller = await sellerRepository.findById(sellerId);
    if (!seller) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }
    if (seller.verificationStatus !== SELLER_VERIFICATION_STATUS.VERIFIED) {
      throw new ApiError(409, "Seller profile can't block now.");
    }

    seller.sellerStatus = SELLER_STATUS.BLOCKED;
    seller.blockReason = blockReason;
    seller.reviewedBy = new Types.ObjectId(adminId);
    seller.reviewedAt = new Date();
    await seller.save();
    return toAdminSellerDto(seller);
  }

  async unblock(sellerId: string, adminId: string) {
    const seller = await sellerRepository.findById(sellerId);
    if (!seller) {
      throw new ApiError(404, "Seller profile doesn't exist.");
    }
    if (seller.sellerStatus !== SELLER_STATUS.BLOCKED) {
      throw new ApiError(409, "Seller profile can't un-block now.");
    }

    seller.sellerStatus = SELLER_STATUS.ACTIVE;
    seller.blockReason = null;
    seller.reviewedBy = new Types.ObjectId(adminId);
    seller.reviewedAt = new Date();
    await seller.save();
    return toAdminSellerDto(seller);
  }

  async getSellerListing({
    userId,
    scope,
    state,
    district,
    village,
    vegetableIds,
    latitude,
    longitude,
    radiusInKm = DEFAULT_RADIUS_KM,
    limit = DEFAULT_LIMIT,
  }: GetSellerListingParams) {
    if (!scope && (state || district || village)) {
      throw new ApiError(400, "Scope is required for location search.");
    }
    const safeLimit = Math.min(Math.max(Math.floor(limit), 1), MAX_LIMIT);

    if (!Number.isFinite(radiusInKm) || radiusInKm <= 0) {
      throw new ApiError(400, "Invalid radiusInKm");
    }

    let normalizedVegetableIds: Types.ObjectId[] | undefined;

    if (vegetableIds?.length) {
      const invalidVegetableId = vegetableIds.find(
        (id) => !Types.ObjectId.isValid(id),
      );

      if (invalidVegetableId) {
        throw new ApiError(400, `Invalid vegetable ID: ${invalidVegetableId}`);
      }

      normalizedVegetableIds = vegetableIds.map((id) => new Types.ObjectId(id));
    }

    const today = getTodayBusinessDate();

    /**
     * =====================================================
     * CASE 1:
     * Buyer explicitly explores another location.
     * =====================================================
     */

    if (scope) {
      if (!state?.trim()) {
        throw new ApiError(400, "State is required for location search");
      }

      if (scope === "village") {
        if (!state) {
          throw new ApiError(400, "State is required for village search");
        }
        if (!district) {
          throw new ApiError(400, "District is required for village search");
        }
        const stateInfo = await locationRepository.findStateByName(
          state as string,
        );
        if (!stateInfo) {
          throw new ApiError(400, "We're not serving at this state.");
        }
        const districtInfo =
          await locationRepository.findDistrictByNameAndStateId(
            district as string,
            stateInfo._id,
          );
        if (!districtInfo) {
          throw new ApiError(400, "Invalid search.");
        }
        const villageInfo =
          await locationRepository.findVillageByNameAndDistrictId(
            village as string,
            districtInfo._id,
          );
        if (!villageInfo) {
          throw new ApiError(400, "Invalid search");
        }
      }

      if (scope === "district") {
        const stateInfo = await locationRepository.findStateByName(
          state as string,
        );
        if (!stateInfo) {
          throw new ApiError(400, "We're not serving at this state.");
        }
        const districtInfo =
          await locationRepository.findDistrictByNameAndStateId(
            district as string,
            stateInfo._id,
          );
        if (!districtInfo) {
          throw new ApiError(400, "Invalid search.");
        }
        if (village) {
          throw new ApiError(
            400,
            "Village should not be provided for district search",
          );
        }
      }

      if (scope === "state") {
        const stateInfo = await locationRepository.findStateByName(
          state as string,
        );
        if (!stateInfo) {
          throw new ApiError(400, "We're not serving at this state.");
        }
        if (district && village) {
          throw new ApiError(
            400,
            "District and village should not be provided for state search",
          );
        } else if (district) {
          throw new ApiError(
            400,
            "District should not be provided for state search",
          );
        } else if (village) {
          throw new ApiError(
            400,
            "Village should not be provided for state search",
          );
        }
      }

      const pipeline = sellerPipeline.getBroadSellerPipeline({
        scope,
        state: state.trim(),
        ...(district?.trim()
          ? {
              district: district.trim(),
            }
          : {}),
        ...(village?.trim()
          ? {
              village: village.trim(),
            }
          : {}),
        ...(normalizedVegetableIds
          ? { normalizedVegetableIds: normalizedVegetableIds }
          : {}),
        ...(userId ? { userId: new Types.ObjectId(userId) } : {}),
        today,
        limit: safeLimit,
      });

      const sellers = await User.aggregate(pipeline);

      return {
        data: sellers,

        matchingMode: scope.toUpperCase(),
      };
    }

    /**
     * =====================================================
     * CASE 2:
     * Unregistered visitor.
     * =====================================================
     */

    if (!userId) {
      const pipeline = sellerPipeline.getPublicSellerPipeline({
        today,
        ...(normalizedVegetableIds
          ? { normalizedVegetableIds: normalizedVegetableIds }
          : {}),
        limit: safeLimit,
      });

      const sellers = await User.aggregate(pipeline);

      return {
        data: sellers,
        matchingMode: "PUBLIC",
      };
    }

    /**
     * =====================================================
     * CASE 3:
     * Logged-in buyer.
     * =====================================================
     */

    const buyer = await User.findById(userId)
      .select("location geoLocation")
      .lean();

    if (!buyer) {
      throw new ApiError(404, "User not found");
    }

    const seller = await sellerRepository.findByIdWithUser(userId);

    /**
     * GPS matching first.
     */
    if (
      longitude !== undefined &&
      latitude !== undefined &&
      Number.isFinite(longitude) &&
      Number.isFinite(latitude)
    ) {
      const pipeline = sellerPipeline.getGeoSellerPipeline({
        longitude,
        latitude,
        radiusInKm,
        ...(normalizedVegetableIds
          ? { normalizedVegetableIds: normalizedVegetableIds }
          : {}),
        ...(userId ? { userId: new Types.ObjectId(userId) } : {}),
        today,
        limit: safeLimit,
      });

      const sellers = await User.aggregate(pipeline);

      return {
        data: sellers,
        matchingMode: "NEARBY",
      };
    }

    /**
     * No GPS:
     * use buyer's own village.
     */
    if (
      buyer.location?.state &&
      buyer.location?.district &&
      buyer.location?.village
    ) {
      const pipeline = sellerPipeline.getBroadSellerPipeline({
        scope: "village",

        state: buyer.location.state,

        district: buyer.location.district,

        village: buyer.location.village,
        ...(normalizedVegetableIds
          ? { normalizedVegetableIds: normalizedVegetableIds }
          : {}),
        today,

        limit: safeLimit,
      });

      const sellers = await User.aggregate(pipeline);

      return {
        data: sellers,
        matchingMode: "VILLAGE",
      };
    }

    /**
     * Last fallback.
     */
    const pipeline = sellerPipeline.getPublicSellerPipeline({
      ...(normalizedVegetableIds
        ? { normalizedVegetableIds: normalizedVegetableIds }
        : {}),
      today,
      limit: safeLimit,
    });

    const sellers = await User.aggregate(pipeline);

    return {
      data: sellers,
      matchingMode: "PUBLIC",
    };
  }

  async getCallSellerDetails(sellerId: string) {
    const result = await sellerRepository.findByIdWithUser(sellerId);
    if (!result) {
      throw new ApiError(404, "No details found");
    }
    return toCallSellerDetails(result);
  }
}

export const sellerService = new SellerService();

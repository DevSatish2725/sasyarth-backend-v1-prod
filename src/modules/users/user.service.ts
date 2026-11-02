import { ApiError } from "../../utils/ApiError";
import {
  UpdateProfileDto,
  UpdateProfilePayloadDto,
  UserProfileDto,
} from "./user.dto";
import { userRepository } from "./user.repository";
import { toUserProfileDto } from "./user.mapper";
import { sellerRepository } from "../seller/seller.repository";
import { locationRepository } from "../location/location.repository";
import { Types } from "mongoose";

class UserService {
  async updateProfile(
    id: string,
    payload: UpdateProfilePayloadDto,
  ): Promise<UserProfileDto> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not exist");
    }

    const sellerProfile = await sellerRepository.findByUserId(id);
    if (payload?.location && !sellerProfile) {
      throw new ApiError(400, "Location is not allowed.");
    }

    const location: {
      stateId: Types.ObjectId | null;
      districtId: Types.ObjectId | null;
      villageId: Types.ObjectId | null;
      habitationId: Types.ObjectId | null;
      maujaId: Types.ObjectId | null;
      blockId: Types.ObjectId | null;
      pincode: string;
    } = {
      stateId: null,
      districtId: null,
      villageId: null,
      habitationId: null,
      maujaId: null,
      blockId: null,
      pincode: "",
    };

    if (payload?.location && sellerProfile && user?.location) {
      const {
        stateId,
        districtId,
        villageId,
        habitationId,
        maujaId,
        blockId,
        pincode,
      } = payload.location;

      const [
        existingState,
        existingDistrict,
        existingBlock,
        existingVillage,
        existingMauja,
        existingHabitation,
      ] = await Promise.all([
        locationRepository.findStateById(user.location.stateId),
        locationRepository.findDistrictById(user.location.districtId),
        locationRepository.findBlockById(user.location.blockId),
        locationRepository.findVillageById(user.location.villageId),
        locationRepository.findMaujaById(user.location.maujaId),
        locationRepository.findHabitationById(user.location.habitationId),
      ]);

      const [
        newState,
        newDistrict,
        newBlock,
        newVillage,
        newMauja,
        newHabitation,
      ] = await Promise.all([
        locationRepository.findStateById(new Types.ObjectId(stateId)),
        locationRepository.findDistrictById(new Types.ObjectId(districtId)),
        locationRepository.findBlockById(new Types.ObjectId(blockId)),
        locationRepository.findVillageById(new Types.ObjectId(villageId)),
        locationRepository.findMaujaById(new Types.ObjectId(maujaId)),
        locationRepository.findHabitationById(new Types.ObjectId(habitationId)),
      ]);

      if (!newState) {
        throw new ApiError(409, "Select valid state.");
      }

      if (!newDistrict) {
        throw new ApiError(409, "Select valid district.");
      }

      if (!newBlock) {
        throw new ApiError(409, "Select valid block.");
      }

      if (!newVillage) {
        throw new ApiError(409, "Select valid village.");
      }

      if (!newMauja) {
        throw new ApiError(409, "Select valid mauja.");
      }

      if (!newHabitation) {
        throw new ApiError(409, "Select valid habitation.");
      }

      const hasLocationChanged =
        payload.location !== undefined &&
        (stateId !== existingState!._id.toString() ||
          districtId !== existingDistrict!._id.toString() ||
          blockId !== existingBlock!._id.toString() ||
          villageId !== existingVillage!._id.toString() ||
          maujaId !== existingMauja!._id.toString() ||
          habitationId !== existingHabitation!._id.toString() ||
          payload.location.pincode !== user.location?.pincode);

      if (hasLocationChanged && user.geoLocation && !payload.geoLocation) {
        throw new ApiError(
          400,
          "Please provide updated coordinates when changing your location.",
        );
      }
      if (payload.geoLocation && !payload.location) {
        throw new ApiError(
          400,
          "Please provide location details when updating coordinates.",
        );
      }

      location.stateId = newState._id;
      location.districtId = newDistrict._id;
      location.blockId = newBlock._id;
      location.villageId = newVillage._id;
      location.maujaId = newMauja._id;
      location.habitationId = newHabitation._id;
      location.pincode = pincode;
    }

    const updatePayload: UpdateProfileDto = {
      ...(payload.fullName !== undefined && {
        fullName: payload.fullName,
      }),

      ...(payload.preferredLanguage !== undefined && {
        preferredLanguage: payload.preferredLanguage,
      }),

      ...(payload.location !== undefined && {
        location,
      }),

      ...(payload.geoLocation !== undefined && {
        geoLocation: payload.geoLocation,
      }),
    };
    Object.assign(user, updatePayload);

    await user.save();
    return toUserProfileDto(user);
  }
}

export const userService = new UserService();

import { ApiError } from "../../utils/ApiError";
import { UpdateProfileDto, UpdateProfilePayloadDto, UserProfileDto } from "./user.dto";
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

    const location = {
      state: "",
      district: "",
      village: "",
      pincode: "",
    };

    if (payload?.location && sellerProfile && user?.location) {
      const { stateId, districtId, villageId, pincode } = payload.location;

      const existingState = await locationRepository.findStateByName(
        user.location.state,
      );

      const existingDistrict =
        await locationRepository.findDistrictByNameAndStateId(
          user.location.district,
          existingState!._id,
        );
      const existingVillage =
        await locationRepository.findVillageByNameAndDistrictId(
          user.location.village,
          existingDistrict!._id,
        );

      const newState = await locationRepository.findStateById(
        new Types.ObjectId(stateId),
      );
      if (!newState) {
        throw new ApiError(404, "This state is not allowed.");
      }
      const newDistrict = await locationRepository.findDistrictById(
        new Types.ObjectId(districtId),
      );
      if (!newDistrict) {
        throw new ApiError(404, "This district is not allowed.");
      }
      const newVillage = await locationRepository.findVillageById(
        new Types.ObjectId(villageId),
      );
      if (!newVillage) {
        throw new ApiError(404, "This village is not allowed.");
      }

      const hasLocationChanged =
        payload.location !== undefined &&
        (payload.location.villageId !== existingVillage!._id.toString() ||
          payload.location.districtId !== existingDistrict!._id.toString() ||
          payload.location.stateId !== existingState!._id.toString() ||
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

      location.state = newState.name;
      location.district = newDistrict.name;
      location.village = newVillage.name;
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

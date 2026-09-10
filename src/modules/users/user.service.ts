import { ApiError } from "../../utils/ApiError";
import { UpdateProfileDto, UserProfileDto } from "./user.dto";
import { userRepository } from "./user.repository";
import { toUserProfileDto } from "./user.mapper";

class UserService {
  async updateProfile(
    id: string,
    payload: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, "User not exist");
    }
    Object.assign(user, payload);

    await user.save();
    return toUserProfileDto(user);
  }
}

export const userService = new UserService();

import { Types } from "mongoose";

import { User } from "./user.model.js";
import { UpdateLocationPayload, UserDocument } from "./user.types";

class UserRepository {
  create(payload: Partial<UserDocument>) {
    return User.create(payload);
  }

  findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return User.findById(id);
  }

  async findByIdWithMobileNumber(id: string | Types.ObjectId): Promise<UserDocument | null> {
    const user = await User.findById(id).select("+mobileNumber");
    return user;
  }

  findByPhone(mobileNumber: string) {
    return User.findOne({ mobileNumber });
  }

  findByPhoneWithPassword(mobileNumber: string) {
    return User.findOne({ mobileNumber });
  }

  existsByPhone(mobileNumber: string) {
    return User.exists({ mobileNumber });
  }

  updateLastLogin(id: string | Types.ObjectId) {
    return User.findByIdAndUpdate(
      id,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      },
    );
  }
async updateLocation(
  userId: string | Types.ObjectId,
  data: UpdateLocationPayload,
): Promise<UserDocument | null> {
  return User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        location: data.location,
        geoLocation: data.geoLocation,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("+mobileNumber")
    .exec();
}
}

export const userRepository = new UserRepository();

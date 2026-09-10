import { Types } from "mongoose";

import { User } from "./user.model.js";
import { UserDocument } from "./user.types";

class UserRepository {
  create(payload: Partial<UserDocument>) {
    return User.create(payload);
  }

  findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return User.findById(id);
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
}

export const userRepository = new UserRepository();

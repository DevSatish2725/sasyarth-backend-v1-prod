import { Model } from "mongoose";
import type { UserEntity } from "./user.types";

export interface IUserMethods {
  verifyPassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<UserEntity, {}, IUserMethods> {}

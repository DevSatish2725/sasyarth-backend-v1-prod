import { Types } from "mongoose";
import { Seller } from "./seller.model";
import {
  SellerDocument,
  SellerVerificationStatus,
  SellerWithPersonalDetails,
  SellerWithUserEntity,
} from "./seller.types";
import { applySellerDto } from "./seller.dto";

class SellerRepository {
  create(payload: applySellerDto) {
    return Seller.create(payload);
  }
  findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<SellerDocument | null> {
    return Seller.findOne({ userId });
  }

  async findByIdWithUser(sellerId: string): Promise<SellerWithUserEntity | null> {
    return Seller.findById(sellerId).populate<{
      userId: {
        _id: Types.ObjectId;
        fullName: string;
         mobileNumber: string;
    location: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    }
    }}>({
      path: "userId",
      select: "fullName mobileNumber location",
    }).lean<SellerWithUserEntity>();
  }

  findByVerificationStatus(
    status: SellerVerificationStatus,
  ): Promise<SellerWithPersonalDetails[]> {
    return Seller.find({
      verificationStatus: status,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "userId",
        select: "fullName mobileNumber location",
      })
      .lean<SellerWithPersonalDetails[]>();
  }

  findById(id: string) {
    return Seller.findById(id);
  }

  findByIdWithPersonalDetails(
    id: string,
  ): Promise<SellerWithPersonalDetails | null> {
    return Seller.findById(id)
      .populate({
        path: "userId",
        select: "fullName mobileNumber location",
      })
      .lean<SellerWithPersonalDetails>();
  }
}

export const sellerRepository = new SellerRepository();

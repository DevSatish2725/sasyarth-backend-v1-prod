import { toSellerAdminDto, toSellerProfileDto } from "../seller/seller.mapper";
import { sellerRepository } from "../seller/seller.repository";
import { SellerVerificationStatus } from "../seller/seller.types";

class AdminService {
  async adminList(status: SellerVerificationStatus) {
    const sellers = await sellerRepository.findByVerificationStatus(status);

    return sellers.map(toSellerAdminDto);
  }
}

export const adminService = new AdminService();

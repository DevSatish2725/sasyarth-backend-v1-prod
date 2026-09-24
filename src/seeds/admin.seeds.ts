import { User } from "../modules/users/user.model";
import { USER_ACCOUNT_TYPES } from "../modules/users/user.constants";
import { logger } from "../config/logger";
import { env } from "../config/env";

export const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      accountType: USER_ACCOUNT_TYPES.ADMIN,
    });

    if (existingAdmin) {
      logger.info("Admin already exists. Skipping admin seed.");
      return;
    }

    const admin = await User.create({
      fullName: env.ADMIN_NAME,
      mobileNumber: env.ADMIN_MOBILE_NUMBER,
      accountType: USER_ACCOUNT_TYPES.ADMIN,
      isPhoneVerified: true,
    });

    logger.info(`Admin created successfully: ${admin.mobileNumber}`);
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Admin creation failed.",
    );
  }
};

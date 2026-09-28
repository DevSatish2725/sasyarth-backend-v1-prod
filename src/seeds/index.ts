import { connectDatabase } from "../config/database";
import { logger } from "../config/logger";
// import { seedLocations } from "./locations.seeds";
import { seedVegetables } from "./vegetables.seed";

const run = async () => {
  try {
    logger.info("Starting database seed...");

    await connectDatabase();

    logger.info("Database connected successfully.");

    // await seedAdmin();
    await seedVegetables();
    // await seedLocations();

    logger.info("Database seed completed successfully.");

    process.exit(0);
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Database seed failed.",
    );
    process.exit(1);
  }
};

run();

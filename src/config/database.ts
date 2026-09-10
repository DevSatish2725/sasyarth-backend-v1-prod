/**
 * ============================================================
 * Module      : Configuration
 * File        : database.ts
 *
 * Purpose:
 * Establishes the connection between GreenBridge and MongoDB.
 *
 * Business Context:
 * Every business operation—user registration, inventory updates,
 * orders, negotiations, and notifications—depends on a healthy
 * database connection.
 *
 * Why:
 * GreenBridge should never start accepting requests unless the
 * database is available. This follows the Fail-Fast principle and
 * prevents inconsistent application behavior.
 *
 * ============================================================
 */

import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

/**
 * Connects the application to MongoDB.
 *
 * Business Context:
 * Without a database connection, GreenBridge cannot perform any
 * business operations safely. Therefore, the server will only start
 * after a successful connection.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error(error, "❌ Failed to connect to MongoDB");

    process.exit(1);
  }
};
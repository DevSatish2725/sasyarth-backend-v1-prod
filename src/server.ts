/**
 * ============================================================
 * Module      : Application Bootstrap
 * File        : server.ts
 *
 * Purpose:
 * Bootstraps the GreenBridge application.
 *
 * Business Context:
 * The server should only begin accepting HTTP requests after
 * all critical infrastructure (database, configuration, etc.)
 * has been successfully initialized.
 *
 * Why:
 * Following the Fail-Fast principle prevents the application
 * from running in a partially initialized state.
 * ============================================================
 */

import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { logger } from "./config/logger";

/**
 * Starts the GreenBridge backend.
 *
 * Startup Sequence:
 * 1. Connect Database
 * 2. Start HTTP Server
 */
const startServer = async (): Promise<void> => {
  try {
    /**
     * Connect MongoDB before accepting requests.
     */
    await connectDatabase();
    const port = Number(process.env.PORT) || 5000;

    app.listen(port, "0.0.0.0", () => {
      logger.info(
        `🚀 GreenBridge Server is running on http://localhost:${port}`,
      );
    });
  } catch (error) {
    logger.fatal(error, "Failed to bootstrap application");

    process.exit(1);
  }
};

startServer();

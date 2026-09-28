/**
 * ============================================================
 * Module      : Configuration
 * File        : env.ts
 *
 * Purpose:
 * Loads and validates all environment variables.
 *
 * Business Context:
 * Every GreenBridge module (Database, Authentication,
 * Notifications, etc.) depends on environment variables.
 *
 * Why:
 * We validate everything at startup so configuration errors
 * are caught before the server begins accepting requests.
 * ============================================================
 */

import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1),

  JWT_REGISTRATION_SECRET: z.string().min(32),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_PASSWORD_RESET_SECRET: z.string().min(32),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsedEnv.error.format());

  process.exit(1);
}

export const env = parsedEnv.data;

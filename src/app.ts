/**
 * ============================================================
 * File: app.ts
 *
 * Purpose:
 * Creates and configures the Express application.
 *
 * Responsibilities:
 * - Register global middleware
 * - Register application routes
 * - Register 404 middleware
 * - Register global error handler
 * ============================================================
 */

import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

import { notFound } from "./shared/middleware/notFound";
import { globalErrorHandler } from "./shared/middleware/globalErrorHandler";
import { authRouter } from "./modules/auth/index";
import router from "./modules/health/health.routes";
import { userRouter } from "./modules/users/index";
import { sellerRouter } from "./modules/seller/index";
import { adminRouter } from "./modules/admin/index";
import { adminVegetableRouter } from "./modules/vegetable/index";
import { vegetableRouter } from "./modules/vegetable/index";
import { dailyInventoryRouter } from "./modules/inventory/dailyInventory/index";
import { sellersRouter } from "./modules/sellers/index";
import { locationRouter } from "./modules/location/index";

const app = express();

/**
 * -----------------------
 * Global Middlewares
 * -----------------------
 */

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://sasyarth-frontend-prod.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/**
 * -----------------------
 * Health Check Route
 * -----------------------
 */

app.get("/health", router);

/**
 * -----------------------
 * Route Registration
 * -----------------------
 */

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin/vegetables", adminVegetableRouter);
app.use("/api/v1/vegetables", vegetableRouter);
app.use("/api/v1/seller/inventory", dailyInventoryRouter);
app.use("/api/v1/sellers", sellersRouter);
app.use("/api/v1/locations", locationRouter);

/**
 * -----------------------
 * 404 Middleware
 * -----------------------
 */

app.use(notFound);

/**
 * -----------------------
 * Global Error Handler
 * -----------------------
 */

app.use(globalErrorHandler);

export default app;

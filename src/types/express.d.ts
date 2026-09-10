import type { AuthUser, SellerId } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sellerId?: SellerId
    }
  }
}

export {};
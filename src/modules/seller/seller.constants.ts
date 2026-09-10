export const SELLER_VERIFICATION_STATUS = {
  NOT_APPLIED: "NOT_APPLIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export const BUSINESS_TYPES = {
  INDIVIDUAL_FARMER: "INDIVIDUAL_FARMER",
  FPO: "FPO",
  TRADER: "TRADER",
  WHOLESALER: "WHOLESALER",
} as const;

export const DOCUMENT_TYPES = {
  AADHAAR_FRONT: "AADHAAR_FRONT",
  AADHAAR_BACK: "AADHAAR_BACK",
  VOTER_ID: "VOTER_ID",
  PAN: "PAN",
  DRIVING_LICENSE: "DRIVING_LICENSE",
  OTHER: "OTHER",
} as const;

export const SELLER_MESSAGES = {
  REQUEST_ALREADY_SENT: "Seller request is already sent.",
  REQUEST_RECEIVED: "Seller request received.",
  REQUEST_VERIFIED: "Seller request verified.",
  REQUEST_REVIEW: "Seller request is under review.",
  SELLER_PROFILE_FETCHED: "Seller profile fetched.",
  SELLER_PROFILE_NOT_EXIST: "Seller profile doesn't exist.",
  SELLERS_FETCHED: "Seller applications fetched successfully.",
  REQUEST_NOT_PENDING: "Request is not pending.",
  REQUEST_REJECTED: "Request is rejected.",
  SELLER_PROFILE_BLOCKED: "Seller profile is blocked.",
  SELLER_PROFILE_UNBLOCKED: "Seller profile is active.",
} as const;

export const SELLER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export const DEFAULT_RADIUS_KM = 20;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

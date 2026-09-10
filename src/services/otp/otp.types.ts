/**
 * Represents a single OTP issued for a phone number.
 *
 * Business Rule:
 * The actual OTP is never stored.
 * Only its hash is stored to prevent accidental exposure.
 */
export interface OtpRecord {
  otpHash: string;

  expiresAt: Date;

  attempts: number;

  createdAt: Date;
}
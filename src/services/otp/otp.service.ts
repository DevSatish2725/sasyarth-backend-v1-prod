/**
 * ============================================================
 * File: otp.service.ts
 *
 * Purpose:
 * Handles all OTP-related operations.
 *
 * Business Context:
 * OTPs are used to verify ownership of a user's phone number
 * before allowing sensitive operations such as registration
 * or password reset.
 *
 * Business Rules:
 * 1. OTPs are never stored in plain text.
 * 2. Every OTP expires after a fixed duration.
 * 3. Only one active OTP exists per phone number.
 * 4. Every new OTP invalidates the previous one.
 * 5. OTP verification is the only way to prove phone ownership.
 *
 * Why:
 * Keeps OTP generation and verification logic centralized,
 * reusable and independent from the Auth module.
 * ============================================================
 */

import bcrypt from "bcrypt";
import { OTP_CONSTANTS } from "./otp.constants.js";
import type { OtpRecord } from "./otp.types.js";

class OtpService {
  /**
   * In-memory storage.
   *
   * Key   -> Phone Number
   * Value -> OTP Record
   */
  private otpStore = new Map<string, OtpRecord>();

  /**
   * Generates a random numeric OTP.
   *
   * Example:
   * 483921
   */
  private generateRandomOtp(): string {
    const min = 100000;
    const max = 999999;

    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  private async hashOtp(otp: string): Promise<string> {
    return bcrypt.hash(otp, OTP_CONSTANTS.BCRYPT_ROUNDS);
  }
  private calculateExpiry(): Date {
    return new Date(Date.now() + OTP_CONSTANTS.EXPIRY_IN_MINUTES * 60 * 1000);
  }

  private isExpired(expiresAt: Date): boolean {
    return Date.now() > expiresAt.getTime();
  }

  /**
   * Generates and stores a new OTP.
   *
   * Business Rule:
   * Every new OTP automatically replaces
   * any previous OTP for the same phone number.
   */
  async generateOtp(phone: string): Promise<string> {
    const otp = this.generateRandomOtp();

    const otpHash = await this.hashOtp(otp);

    this.otpStore.set(phone, {
      otpHash,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: this.calculateExpiry(),
    });

    return otp;
  }

  hasActiveOtp(mobileNumber: string): boolean {
    const record = this.otpStore.get(mobileNumber);

    if (!record) {
      return false;
    }

    if (this.isExpired(record.expiresAt)) {
      this.otpStore.delete(mobileNumber);
      return false;
    }

    return true;
  }

  /**
   * Verifies whether an OTP is valid.
   *
   * Returns:
   * true  -> OTP is correct
   * false -> Invalid or expired
   */
  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const record = this.otpStore.get(phone);
    if (!record) {
      return false;
    }

    if (this.isExpired(record.expiresAt)) {
      this.otpStore.delete(phone);
      return false;
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);

    if (!isValid) {
      record.attempts++;
      return false;
    }

    this.otpStore.delete(phone);

    return true;
  }

  /**
   * Removes an OTP manually.
   *
   * Useful after successful registration
   * or administrative cleanup.
   */
  deleteOtp(phone: string): void {
    this.otpStore.delete(phone);
  }

  /**
   * Removes expired OTPs.
   *
   * Can later be executed periodically
   * using a Cron Job.
   */
  cleanupExpiredOtps(): void {
    const now = Date.now();

    for (const [phone, record] of this.otpStore.entries()) {
      if (this.isExpired(record.expiresAt)) {
        this.otpStore.delete(phone);
      }
    }
  }
}

export const otpService = new OtpService();

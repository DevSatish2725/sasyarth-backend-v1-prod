/**
 * ============================================================
 * File: sms.service.ts
 *
 * Purpose:
 * Handles SMS delivery.
 *
 * Responsibilities:
 * - Send OTP SMS.
 * - Send transactional SMS.
 * - Integrate with providers like MSG91 or Twilio.
 *
 * This service should NEVER:
 * - Generate OTP.
 * - Verify OTP.
 * - Access the database.
 * ============================================================
 */

class SmsService {
  async sendOtp(mobileNumber: string, otp: string): Promise<void> {
    console.log(`[SMS] OTP ${otp} sent to ${mobileNumber}`);
  }
}

export const smsService = new SmsService();

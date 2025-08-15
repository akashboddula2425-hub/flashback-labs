import { z } from "zod";

export const phoneNumberSchema = z.object({
  phoneNumber: z.string().regex(/^\+91\d{10}$/, "Phone number must be in +91XXXXXXXXXX format")
});

export const otpVerificationSchema = z.object({
  phoneNumber: z.string().regex(/^\+91\d{10}$/, "Phone number must be in +91XXXXXXXXXX format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  login_platform: z.literal("MobileApp")
});

export const userSessionSchema = z.object({
  phoneNumber: z.string(),
  token: z.string(),
  loginTime: z.string(),
  selfieUrl: z.string().optional()
});

export type PhoneNumberRequest = z.infer<typeof phoneNumberSchema>;
export type OTPVerificationRequest = z.infer<typeof otpVerificationSchema>;
export type UserSession = z.infer<typeof userSessionSchema>;

import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction, Request, Response } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import prisma from "@packages/libs/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// validate registration data
export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
    throw new ValidationError("Missing required fields for registration");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }

  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }
};

// check OTP request restrictions
export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Account locked due to multiple failed attempts. Please try again after 30 minutes."));
  }
  if (await redis.get(`otp_span_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests. wait 1 hour before trying again."));
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("Please wait 1minute before requesting a new OTP."));
  }
}

// track OTP requests for rate limiting
export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_requests_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_span_lock:${email}`, "locked", "EX", 3600);                // 1 hour lock
    return next(new ValidationError("Too many OTP requests. wait 1hour before trying again."));
  }

  await redis.set(otpRequestKey, (otpRequests + 1).toString(), "EX", 3600);                     // Track requests for 1 hour
}

// send OTP to user's email
export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verification your Email", template, { name, otp });         // send OTP email
  await redis.set(`otp:${email}`, otp, 'EX', 300);                                    // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);                         // 1 minute cooldown
}

// verify OTP
export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP.");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);     // Lock account for 30 minutes
      await redis.del(`otp:${email}`);                             // Invalidate OTP
      throw next(new ValidationError("Too many failed attempts. Account locked for 30 minutes."));
    }
    await redis.set(failedAttemptsKey, (failedAttempts + 1).toString(), 'EX', 300);  // Track failed attempts for 5 minutes
    throw new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left`);
  }

  await redis.del(`otp:${email}`);
}

// Forgot Password
export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: "user" | "seller") => {
  try {
    const { email } = req.body

    if (!email) throw new ValidationError("Email is required!");

    // find user|seller in DB
    const user =
      userType === "user"
        ? (await prisma.users.findUnique({ where: { email } }))
        : await prisma.sellers.findUnique({ where: { email } }
        )

    if (!user) throw new ValidationError(`${userType} not found!`);

    // check OTP restrictions
    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);

    //Generate OTP and send Email
    await sendOtp(user.name, email, userType === "user" ? "forgot-password-user-mail" : "forgot-password-seller-mail");

    res.status(200).json({ message: "OTP send to email, Please verify your account!" })
  } catch (error) {
    next(error);
  }
}

// Verify Forgot Password OTP
export const verifyFordotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      throw new ValidationError(`Email and OTP are required`);

    await verifyOtp(email, otp, next);

    res.status(200).json({ message: "OTP verified, you can now reset your password!" })
  } catch (error) {
    next(error)
  }
}
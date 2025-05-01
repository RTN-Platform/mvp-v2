
import * as z from "zod";

// Define schemas for authentication forms
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Define types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// New schema for profile interests
export const interestsSchema = z.array(
  z.string().min(1).max(30)
).optional().default([]);

// New schemas for host information
export const hostSchema = z.object({
  isHost: z.boolean().default(false),
  venueName: z.string().optional(),
  venueType: z.string().optional(),
  venueLocation: z.string().optional(),
  venueDescription: z.string().optional(),
});


import { z } from "zod";

export const accommodationFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_night: z.number().min(0, { message: "Price must be a positive number" }),
  bedrooms: z.number().min(1, { message: "Must have at least 1 bedroom" }),
  bathrooms: z.number().min(0.5, { message: "Must have at least 0.5 bathroom" }),
  max_guests: z.number().min(1, { message: "Must accommodate at least 1 guest" }),
  house_rules: z.string().optional(),
  is_published: z.boolean().default(false),
  booking_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.string().max(0)),
});

export const experienceFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_person: z.number().min(0, { message: "Price must be a positive number" }),
  duration: z.number().min(15, { message: "Duration must be at least 15 minutes" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1 person" }),
  requirements: z.string().optional(),
  is_published: z.boolean().default(false),
  booking_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.string().max(0)),
});

export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;
export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

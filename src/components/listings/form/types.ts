
import { z } from "zod";

// Define the form schema
export const accommodationFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_night: z.number().positive({ message: "Price must be greater than 0" }),
  bedrooms: z.number().int().min(1, { message: "Must have at least 1 bedroom" }),
  bathrooms: z.number().min(0.5, { message: "Must have at least 0.5 bathrooms" }),
  max_guests: z.number().int().min(1, { message: "Must accommodate at least 1 guest" }),
  house_rules: z.string().optional(),
  is_published: z.boolean().default(false),
});

export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;

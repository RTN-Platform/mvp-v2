
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AccommodationFormValues, ExperienceFormValues, PriceFieldType } from "./types";

interface PricingSectionProps {
  form: UseFormReturn<AccommodationFormValues | ExperienceFormValues>;
  pricingField?: PriceFieldType;
  label?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  form, 
  pricingField = "price_per_night",
  label = "Price per night ($)"
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={pricingField as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                value={field.value?.toString() || "0"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="booking_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>External Booking URL (optional)</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://example.com/booking" 
                {...field} 
                value={field.value || ""} 
              />
            </FormControl>
            <FormDescription>
              If provided, the "Book Now" button will link to this external URL
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PricingSection;


import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AccommodationFormValues } from "./types";

interface PricingSectionProps {
  form: UseFormReturn<AccommodationFormValues>;
  pricingField?: "price_per_night" | "price_per_person";
  label?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  form, 
  pricingField = "price_per_night",
  label = "Price per night ($)"
}) => {
  return (
    <FormField
      control={form.control}
      name={pricingField}
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PricingSection;

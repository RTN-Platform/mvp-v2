
import React from "react";
import { 
  FormField, 
  FormItem, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AccommodationFormValues } from "./types";

interface HouseRulesSectionProps {
  form: UseFormReturn<AccommodationFormValues>;
}

const HouseRulesSection: React.FC<HouseRulesSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="house_rules"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="Enter your house rules..."
              className="min-h-32"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Example: No smoking, No parties or events, No pets, etc.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HouseRulesSection;


import React from "react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ExperienceFormValues } from "./types";

interface ExperienceDetailsSectionProps {
  form: UseFormReturn<ExperienceFormValues>;
}

const ExperienceDetailsSection: React.FC<ExperienceDetailsSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>How long does your experience last?</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Capacity</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>How many guests can join?</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ExperienceDetailsSection;

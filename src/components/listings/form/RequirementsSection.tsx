
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
import { ExperienceFormValues } from "./types";

interface RequirementsSectionProps {
  form: UseFormReturn<ExperienceFormValues>;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="requirements"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="Enter any requirements or prerequisites..."
              className="min-h-32"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Example: Hiking shoes, swimwear, valid ID, minimum fitness level, etc.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RequirementsSection;

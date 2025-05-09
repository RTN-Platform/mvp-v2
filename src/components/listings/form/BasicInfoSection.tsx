
import React from "react";
import { MapPin, Home } from "lucide-react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { AccommodationFormValues } from "./types";

interface BasicInfoSectionProps {
  form: UseFormReturn<AccommodationFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Listing Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a catchy title" {...field} />
            </FormControl>
            <FormDescription>
              A descriptive title helps guests find your place
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your accommodation..."
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Detailed description will help guests understand what makes your place special
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Location
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter address or area" {...field} />
            </FormControl>
            <FormDescription>
              Where is your accommodation located?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Published Status</FormLabel>
              <FormDescription>
                Set whether this listing should be visible to guests
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;


import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { AccommodationFormValues, ExperienceFormValues } from './types';

interface PublishToggleProps {
  form: UseFormReturn<AccommodationFormValues | ExperienceFormValues>;
  fieldName: 'is_published';
}

const PublishToggle: React.FC<PublishToggleProps> = ({ form, fieldName }) => {
  const status = form.watch(fieldName);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base font-medium">Listing Status</FormLabel>
            <FormDescription>
              {status ? 'Published - visible to all users' : 'Draft - only visible to you'}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-nature-600"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PublishToggle;

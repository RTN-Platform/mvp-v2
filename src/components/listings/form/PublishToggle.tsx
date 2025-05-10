
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { AccommodationFormValues, ExperienceFormValues } from './types';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            <div className="flex items-center space-x-2">
              <FormLabel className="text-base font-medium">Listing Status</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      When published, your listing will be visible to all users. 
                      Draft listings are only visible to you.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormDescription>
              {status ? (
                <span className="text-green-600 font-medium">Published - visible to all users</span>
              ) : (
                <span className="text-amber-600">Draft - only visible to you</span>
              )}
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

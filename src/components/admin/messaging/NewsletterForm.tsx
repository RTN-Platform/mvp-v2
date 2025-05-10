
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsletterFormData {
  subject: string;
  body: string;
  sendOption: "now" | "schedule";
  scheduledDate?: Date;
}

const NewsletterForm = () => {
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const form = useForm<NewsletterFormData>({
    defaultValues: {
      subject: "",
      body: "",
      sendOption: "now",
    },
  });

  const sendOption = form.watch("sendOption");

  const onSubmit = async (data: NewsletterFormData) => {
    setLoading(true);
    try {
      // In a real implementation, this would connect to a Supabase function or API
      console.log("Sending newsletter:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Newsletter ${data.sendOption === "now" ? "sent" : "scheduled"} successfully`);
      form.reset();
      setDate(undefined);
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Failed to send newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter newsletter subject" {...field} />
              </FormControl>
              <FormDescription>
                This will be the subject line of the email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your newsletter content here..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Write the main content of your newsletter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sendOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Option</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select when to send" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="now">Send Now</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose when to send this newsletter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {sendOption === "schedule" && (
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the date when this newsletter should be sent.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button 
          type="submit"
          className="bg-nature-600 hover:bg-nature-700 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : sendOption === "now" ? "Send Newsletter" : "Schedule Newsletter"}
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterForm;

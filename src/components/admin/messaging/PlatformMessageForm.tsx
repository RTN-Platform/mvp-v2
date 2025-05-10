
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlatformMessageFormData {
  subject: string;
  content: string;
  recipientType: "all" | "hosts" | "tribe-members";
}

const PlatformMessageForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<PlatformMessageFormData>({
    defaultValues: {
      subject: "",
      content: "",
      recipientType: "all"
    },
  });

  const onSubmit = async (data: PlatformMessageFormData) => {
    setLoading(true);
    try {
      // In a real implementation, this would connect to a Supabase function or API
      console.log("Sending platform message:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Platform message sent to users");
      form.reset();
    } catch (error) {
      console.error("Error sending platform message:", error);
      toast.error("Failed to send message. Please try again.");
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
                <Input placeholder="Enter message subject" {...field} />
              </FormControl>
              <FormDescription>
                A clear subject line helps users identify the message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your message content here..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This message will appear in users' platform inboxes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Recipients</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      All Users
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hosts" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Hosts Only
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="tribe-members" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Tribe Members Only
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select which user groups should receive this message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          className="bg-nature-600 hover:bg-nature-700 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Platform Message"}
        </Button>
      </form>
    </Form>
  );
};

export default PlatformMessageForm;

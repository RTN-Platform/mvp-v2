
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MessageComposerProps {
  recipientId: string;
  onMessageSent: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ recipientId, onMessageSent }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please enter a message before sending."
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        variant: "destructive",
        title: "Subject required",
        description: "Please enter a subject for your message."
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to send messages."
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          subject: subject.trim(),
          content: message.trim(),
          is_read: false,
          is_system: false
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });

      // Clear the form
      setMessage("");
      setSubject("");
      
      // Notify parent component
      onMessageSent();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error.message || "An error occurred while sending your message."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          id="subject"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-nature-500"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter message subject"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={sendMessage} 
          disabled={isSending || !message.trim() || !subject.trim()}
          className="bg-nature-600 hover:bg-nature-700"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;

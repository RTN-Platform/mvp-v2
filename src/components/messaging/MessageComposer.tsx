
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, PaperclipIcon, X } from "lucide-react";
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const newFiles = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...newFiles]);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of newFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `messages/${user?.id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(filePath, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }
      
      setAttachmentUrls(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload files. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = async (index: number) => {
    try {
      // Extract the file path from URL to delete from storage
      const urlToRemove = attachmentUrls[index];
      const pathParts = urlToRemove.split('/listings/');
      if (pathParts.length > 1) {
        const filePath = `listings/${pathParts[1]}`;
        await supabase.storage.from('listings').remove([filePath]);
      }
    } catch (error) {
      console.error('Error removing file from storage:', error);
    }
    
    // Remove from state
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    
    const newUrls = [...attachmentUrls];
    newUrls.splice(index, 1);
    setAttachmentUrls(newUrls);
  };

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
      // Include attachments if any
      const messageContent = attachmentUrls.length > 0 
        ? `${message.trim()}\n\nAttachments:\n${attachmentUrls.join('\n')}`
        : message.trim();

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          subject: subject.trim(),
          content: messageContent,
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
      setAttachments([]);
      setAttachmentUrls([]);
      
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

      {/* Attachments display */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attachments ({attachments.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1 text-sm"
              >
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            id="attachments"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
            disabled={isUploading}
          />
          <label htmlFor="attachments">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
              className="cursor-pointer"
            >
              <span>
                <PaperclipIcon className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Attach Files"}
              </span>
            </Button>
          </label>
        </div>
        
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

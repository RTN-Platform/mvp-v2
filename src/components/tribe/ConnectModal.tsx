
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Member {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSendRequest: (message: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  member,
  onSendRequest,
}) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async () => {
    // Basic validation
    if (!message.trim()) {
      setError("Please include a message with your connection request.");
      return;
    }

    if (message.length > 500) {
      setError("Your message is too long. Please keep it under 500 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await onSendRequest(message);
      setMessage("");
    } catch (err) {
      setError("Failed to send connection request. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sanitize and validate input as user types
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Clear error if user is typing
    if (error) setError("");
    
    // Show error if exceeding max length
    if (value.length > 500) {
      setError(`Message is too long (${value.length}/500 characters)`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-labelledby="connect-dialog-title">
        <DialogHeader>
          <DialogTitle id="connect-dialog-title">Connect with {member.full_name}</DialogTitle>
          <DialogDescription>
            Send a personalized message to introduce yourself and explain why you'd like to connect.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <Avatar>
            <AvatarImage src={member.avatar_url} alt={member.full_name} />
            <AvatarFallback>{member.full_name.split(' ').map(part => part[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{member.full_name}</h4>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="connection-message" className="text-sm font-medium">
            Add a personal message
          </label>
          <Textarea
            id="connection-message"
            placeholder="Hi! I noticed we share an interest in hiking..."
            value={message}
            onChange={handleMessageChange}
            rows={4}
            className={error ? "border-red-300 focus:border-red-500" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? "message-error" : undefined}
          />
          {error && (
            <p id="message-error" className="text-sm text-red-500">
              {error}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {message.length}/500 characters
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            disabled={isSubmitting || message.length > 500}
            className="w-full sm:w-auto bg-nature-600 hover:bg-nature-700"
          >
            {isSubmitting ? "Sending..." : "Send Connection Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TribeMember } from "@/types/tribe";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TribeMember;
  onSendRequest: (message: string) => Promise<boolean>;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  member,
  onSendRequest,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const success = await onSendRequest(message);
      if (success) {
        setMessage("");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {member.full_name}</DialogTitle>
          <DialogDescription>
            Send a connection request to start messaging with this tribe member.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar_url || ""} alt={member.full_name || ""} />
            <AvatarFallback>
              {member.full_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{member.full_name}</h4>
            {member.location && (
              <p className="text-sm text-gray-500">{member.location}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note to introduce yourself... (optional)"
            className="h-24"
          />

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React from "react";
import MessageThread from "./MessageThread";
import { Message } from "@/types/message";

interface MessageContainerProps {
  selectedContactId: string | null;
  messages: Message[];
  isLoading: boolean;
  contactName: string;
  contactAvatar: string | null;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  currentUserId?: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  selectedContactId,
  messages,
  isLoading,
  contactName,
  contactAvatar,
  onSendMessage,
  currentUserId,
}) => {
  if (selectedContactId) {
    return (
      <MessageThread
        messages={messages}
        isLoading={isLoading}
        contactName={contactName}
        contactAvatar={contactAvatar}
        onSendMessage={onSendMessage}
        currentUserId={currentUserId}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a contact to start messaging
    </div>
  );
};

export default MessageContainer;

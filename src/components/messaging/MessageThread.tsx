
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import MessageComposer from "./MessageComposer";
import { Message } from "@/types/message";

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  contactName: string;
  contactAvatar: string | null;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  currentUserId?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isLoading,
  contactName,
  contactAvatar,
  onSendMessage,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center">
        <Avatar className="mr-3">
          <AvatarImage src={contactAvatar || ""} alt={contactName} />
          <AvatarFallback>{contactName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{contactName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spinner size="md" />
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender_id !== currentUserId && (
                  <Avatar className="mr-2 mt-1 h-8 w-8">
                    <AvatarImage
                      src={message.sender.avatar_url || ""}
                      alt={message.sender.full_name}
                    />
                    <AvatarFallback>
                      {message.sender.full_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === currentUserId
                      ? "bg-nature-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Show attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((url, index) => {
                        // Check if it's an image
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                        
                        return isImage ? (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            key={index} 
                            className="block"
                          >
                            <img 
                              src={url} 
                              alt="Attachment" 
                              className="max-h-32 rounded border"
                            />
                          </a>
                        ) : (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            key={index} 
                            className="text-xs text-blue-600 underline block"
                          >
                            {url.split('/').pop() || 'Attachment'}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default MessageThread;

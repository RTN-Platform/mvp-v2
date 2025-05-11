
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import MessageComposer from "./MessageComposer";
import { Message } from "@/types/message";
import { format } from 'date-fns';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  contactName: string;
  contactAvatar: string | null;
  onSendMessage: (content: string, attachments?: File[]) => Promise<Message | null>;
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

  // Function to display the date as a divider
  const renderDateDivider = (date: string) => {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-gray-200 px-3 py-1 rounded-full">
          <span className="text-xs text-gray-600">
            {format(new Date(date), 'MMMM d, yyyy')}
          </span>
        </div>
      </div>
    );
  };

  // Group messages by date for date dividers
  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = format(new Date(message.created_at), 'yyyy-MM-dd');
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const sortedDates = Object.keys(groupedMessages).sort();

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
            {sortedDates.map(date => (
              <React.Fragment key={date}>
                {renderDateDivider(date)}
                {groupedMessages[date].map((message) => (
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
                          : message.is_system
                            ? "bg-blue-50 text-gray-800 border border-blue-100"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {/* System message indicator */}
                      {message.is_system && (
                        <div className="text-xs text-blue-500 font-medium mb-1">System Message</div>
                      )}
                      
                      {/* Message subject for system messages */}
                      {message.is_system && message.subject && (
                        <div className="font-medium mb-1">{message.subject}</div>
                      )}
                      
                      {/* Message content */}
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Message attachments */}
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
                      
                      {/* Message timestamp */}
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {format(new Date(message.created_at), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
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

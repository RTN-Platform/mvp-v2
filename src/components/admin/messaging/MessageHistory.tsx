
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Newspaper } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

interface Message {
  id: string;
  subject: string;
  content: string;
  created_at: string;
  message_type: "newsletter" | "platform" | "posts";
  sender_name?: string;
  sender_avatar?: string;
}

type MessageType = "newsletters" | "platform" | "posts";

interface MessageHistoryProps {
  messageType: string;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messageType: initialMessageType }) => {
  const [activeTab, setActiveTab] = useState<MessageType>(initialMessageType as MessageType || "newsletters");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages(activeTab);
  }, [activeTab]);

  const fetchMessages = async (type: MessageType) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call to retrieve messages by type
      // Simulating with a timeout to mock API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockMessages: Message[] = [
          {
            id: "1",
            subject: "Summer Newsletter 2025",
            content: "Welcome to our summer update with exciting new features...",
            created_at: "2025-05-01T12:00:00",
            message_type: "newsletter",
            sender_name: "Admin Team",
            sender_avatar: null,
          },
          {
            id: "2",
            subject: "Important Platform Update",
            content: "We've made some changes to improve your experience...",
            created_at: "2025-04-15T14:30:00",
            message_type: "platform",
            sender_name: "System",
            sender_avatar: null,
          },
          {
            id: "3",
            subject: "New Host Features Available",
            content: "Check out the new tools for hosts...",
            created_at: "2025-04-10T09:15:00",
            message_type: "posts",
            sender_name: "Admin Team",
            sender_avatar: null,
          },
          {
            id: "4",
            subject: "Spring Newsletter 2025",
            content: "Spring is here and we have exciting updates...",
            created_at: "2025-03-20T10:00:00",
            message_type: "newsletter",
            sender_name: "Marketing Team",
            sender_avatar: null,
          },
        ];

        // Filter messages by type
        const filteredMessages = mockMessages.filter(msg => {
          if (type === "newsletters") return msg.message_type === "newsletter";
          if (type === "platform") return msg.message_type === "platform";
          if (type === "posts") return msg.message_type === "posts";
          return false;
        });

        setMessages(filteredMessages);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "newsletter":
        return <Mail className="h-4 w-4 text-gray-500" />;
      case "platform":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case "posts":
        return <Newspaper className="h-4 w-4 text-gray-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MessageType)}>
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="newsletters" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Newsletters
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Platform Messages
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center">
            <Newspaper className="mr-2 h-4 w-4" />
            Front Page Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="pt-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Message History</h3>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 py-10 text-center">No {activeTab} found.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1">
                          {getMessageIcon(message.message_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{message.subject}</h4>
                            <span className="text-sm text-gray-500">{formatDate(message.created_at)}</span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">{message.content}</p>
                          <div className="flex items-center mt-3">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={message.sender_avatar || ''} alt={message.sender_name || ''} />
                              <AvatarFallback>{message.sender_name?.[0] || 'A'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500">
                              {message.sender_name || "System"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessageHistory;

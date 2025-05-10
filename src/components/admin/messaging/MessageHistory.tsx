
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface Message {
  id: string;
  title: string;
  sentDate: string;
  status: "sent" | "scheduled" | "failed";
  recipients?: string;
  content: string;
}

interface MessageHistoryProps {
  messageType: string;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messageType }) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    // In a real implementation, fetch data from Supabase based on messageType
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock data generation based on message type
      let mockData: Message[] = [];
      
      if (messageType === "newsletters") {
        mockData = [
          {
            id: "1",
            title: "May Newsletter",
            sentDate: "2025-05-01",
            status: "sent",
            recipients: "All Users (253)",
            content: "Welcome to our May newsletter! Here are the updates..."
          },
          {
            id: "2",
            title: "Special Promotion",
            sentDate: "2025-04-15",
            status: "sent",
            recipients: "All Users (245)",
            content: "Don't miss our special promotion..."
          },
          {
            id: "3",
            title: "June Newsletter",
            sentDate: "2025-06-01",
            status: "scheduled",
            recipients: "All Users",
            content: "Preview of our upcoming June newsletter..."
          }
        ];
      } else if (messageType === "platform") {
        mockData = [
          {
            id: "1",
            title: "Platform Maintenance",
            sentDate: "2025-05-05",
            status: "sent",
            recipients: "All Users (253)",
            content: "The platform will be down for maintenance..."
          },
          {
            id: "2",
            title: "New Feature Announcement",
            sentDate: "2025-04-20",
            status: "sent",
            recipients: "All Users (245)",
            content: "We're excited to announce our new features..."
          },
          {
            id: "3",
            title: "Host-only Update",
            sentDate: "2025-05-10",
            status: "sent",
            recipients: "Hosts (42)",
            content: "Important information for hosts..."
          }
        ];
      } else if (messageType === "posts") {
        mockData = [
          {
            id: "1",
            title: "Welcome to Summer Season",
            sentDate: "2025-05-01",
            status: "sent",
            content: "Summer is here, and we've got exciting updates..."
          },
          {
            id: "2",
            title: "New Experiences Available",
            sentDate: "2025-04-25",
            status: "sent",
            content: "Check out these new experiences..."
          },
          {
            id: "3",
            title: "Holiday Special",
            sentDate: "2025-12-01",
            status: "scheduled",
            content: "Get ready for our holiday special..."
          }
        ];
      }
      
      setMessages(mockData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [messageType]);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const handleDeleteMessage = (id: string) => {
    // In a real implementation, this would delete from Supabase
    setMessages(messages.filter(message => message.id !== id));
    toast.success("Message deleted successfully");
  };

  const getMessageTypeTitle = () => {
    switch (messageType) {
      case "newsletters": return "Newsletter";
      case "platform": return "Platform Message";
      case "posts": return "Front Page Post";
      default: return "Message";
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{getMessageTypeTitle()} History</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : messages.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              {messageType !== "posts" && <TableHead>Recipients</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.title}</TableCell>
                <TableCell>{message.sentDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    message.status === "sent" ? "bg-green-100 text-green-800" :
                    message.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                </TableCell>
                {messageType !== "posts" && <TableCell>{message.recipients}</TableCell>}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewMessage(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No {messageType} history found.</p>
        </div>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.title}</DialogTitle>
            <DialogDescription>
              {messageType === "newsletters" && "Newsletter"}
              {messageType === "platform" && "Platform Message"}
              {messageType === "posts" && "Front Page Post"}
              {" sent on "}{selectedMessage?.sentDate}
              {messageType !== "posts" && selectedMessage?.recipients && ` to ${selectedMessage.recipients}`}
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-4 mt-2 bg-gray-50">
            <p className="whitespace-pre-wrap">{selectedMessage?.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageHistory;

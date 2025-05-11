
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import { formatDistance } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface ConnectionRequest {
  id: string;
  inviter_id: string;
  message: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ConnectionRequestsProps {
  requests: ConnectionRequest[];
  onAccept: (requestId: string) => Promise<boolean>;
  onDecline: (requestId: string) => Promise<boolean>;
}

const ConnectionRequests: React.FC<ConnectionRequestsProps> = ({ 
  requests, 
  onAccept, 
  onDecline 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const { toast } = useToast();

  if (!requests || requests.length === 0) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAccept = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const success = await onAccept(requestId);
      if (success) {
        toast({
          title: "Connection Accepted",
          description: "You can now message each other",
        });
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      toast({
        title: "Error",
        description: "Could not accept connection request",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const success = await onDecline(requestId);
      if (success) {
        toast({
          title: "Connection Declined",
          description: "Connection request has been declined",
        });
      }
    } catch (error) {
      console.error('Error declining connection:', error);
      toast({
        title: "Error",
        description: "Could not decline connection request",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <div className="border-b">
      <div 
        className="flex items-center justify-between p-3 bg-nature-50 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <UserPlus size={16} className="mr-2 text-nature-600" />
          <span className="font-medium text-sm">
            Connection Requests ({requests.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isExpanded && (
        <div className="max-h-60 overflow-y-auto">
          {requests.map((request) => (
            <Card key={request.id} className="rounded-none border-x-0 border-t-0">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={request.profiles.avatar_url || undefined} 
                      alt={request.profiles.full_name || "User"} 
                    />
                    <AvatarFallback>
                      {(request.profiles.full_name || "User")[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {request.profiles.full_name || "Unknown User"}
                    </p>
                    {request.message && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        "{request.message}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDistance(new Date(request.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => handleAccept(request.id)}
                      disabled={processingRequest === request.id}
                    >
                      <Check size={14} className="text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => handleDecline(request.id)}
                      disabled={processingRequest === request.id}
                    >
                      <X size={14} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;

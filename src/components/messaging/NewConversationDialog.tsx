
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface Connection {
  connection_id: string;
  connection: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  }
}

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  connections: Connection[];
  onStartConversation: (connectionId: string) => Promise<void>;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  isOpen,
  onClose,
  connections,
  onStartConversation
}) => {
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleStartConversation = async () => {
    if (!selectedConnection) return;
    
    setIsSubmitting(true);
    try {
      await onStartConversation(selectedConnection);
      setSelectedConnection(null);
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isSubmitting ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" />
            </div>
          ) : connections.length > 0 ? (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {connections.map((conn) => (
                <li 
                  key={conn.connection_id}
                  onClick={() => setSelectedConnection(conn.connection.id)}
                  className={`p-3 rounded-md hover:bg-muted cursor-pointer flex items-center space-x-3 ${
                    selectedConnection === conn.connection.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar>
                    <AvatarImage 
                      src={conn.connection.avatar_url || ''} 
                      alt={conn.connection.full_name || ''} 
                    />
                    <AvatarFallback>
                      {conn.connection.full_name?.substring(0, 2) || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{conn.connection.full_name || 'Unnamed User'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">
                No connections found. Connect with members first.
              </p>
              <Button onClick={() => navigate('/tribe')} size="sm">
                Go to Tribe
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStartConversation} 
            disabled={!selectedConnection || isSubmitting}
          >
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;

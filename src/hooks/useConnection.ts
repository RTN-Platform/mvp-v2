
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TribeMemberInterface } from "@/components/tribe/TribeMember";

export const useConnection = () => {
  const [connectingTo, setConnectingTo] = useState<TribeMemberInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleConnect = useCallback((memberId: string, members: TribeMemberInterface[]) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setConnectingTo(member);
      setIsModalOpen(true);
    }
  }, []);

  const handleSendRequest = useCallback(async (message: string) => {
    if (!user || !connectingTo) return;
    
    try {
      console.log('Sending connection request to:', connectingTo.id);
      console.log('Message:', message);
      
      const { data, error } = await supabase
        .from('connections')
        .insert([
          { inviter_id: user.id, invitee_id: connectingTo.id, message, status: 'pending' }
        ]);
      
      if (error) {
        if (error.message.includes('Rate limit exceeded')) {
          toast({
            title: "Rate Limit Exceeded",
            description: "You can only send 3 connection requests per hour.",
            variant: "destructive"
          });
        } else if (error.message.includes('unique constraint')) {
          toast({
            title: "Request Already Sent",
            description: "You've already sent a connection request to this person.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send connection request. Please try again.",
            variant: "destructive"
          });
        }
        console.error('Error sending connection request:', error);
        return;
      }

      console.log('Connection request sent successfully');
      
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${connectingTo.full_name || 'this user'}.`,
      });
      
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, connectingTo, toast]);

  return {
    connectingTo,
    isModalOpen,
    setIsModalOpen,
    handleConnect,
    handleSendRequest
  };
};

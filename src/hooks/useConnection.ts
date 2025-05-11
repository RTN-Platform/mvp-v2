
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TribeMember } from "@/types/tribe";

export const useConnection = () => {
  const [connectingTo, setConnectingTo] = useState<TribeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Handle selecting a member to connect with
   */
  const handleConnect = useCallback((memberId: string, members: TribeMember[]) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setConnectingTo(member);
      setIsModalOpen(true);
    }
  }, []);

  /**
   * Send a connection request to another user
   */
  const handleSendRequest = useCallback(async (message: string) => {
    if (!user || !connectingTo) return false;
    
    try {
      setIsProcessing(true);
      console.log('Sending connection request to:', connectingTo.id);
      console.log('Message:', message);
      
      const { error } = await supabase
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
        return false;
      }

      console.log('Connection request sent successfully');
      
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${connectingTo.full_name || 'this user'}.`,
      });
      
      setIsModalOpen(false);
      setConnectingTo(null);
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, connectingTo, toast]);

  /**
   * Check if a connection request exists between the current user and another user
   */
  const checkConnectionStatus = useCallback(async (userId: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('id, status')
        .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
        .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return {
          exists: true,
          status: data[0].status,
          id: data[0].id
        };
      }
      
      return {
        exists: false,
        status: null,
        id: null
      };
    } catch (error) {
      console.error('Error checking connection status:', error);
      return null;
    }
  }, [user]);

  return {
    connectingTo,
    isModalOpen,
    isProcessing,
    setIsModalOpen,
    handleConnect,
    handleSendRequest,
    checkConnectionStatus
  };
};

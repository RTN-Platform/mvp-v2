
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Loader } from "lucide-react";

interface HostApplication {
  id: string;
  user_id: string;
  venue_name: string;
  venue_type: string;
  venue_location: string;
  venue_description: string;
  contact_email: string;
  contact_phone?: string;
  status: 'pending' | 'approved' | 'declined';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  applicant_name?: string;
}

interface HostApplicationReviewModalProps {
  application: HostApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationUpdated: () => void;
}

const HostApplicationReviewModal: React.FC<HostApplicationReviewModalProps> = ({
  application,
  open,
  onOpenChange,
  onApplicationUpdated,
}) => {
  const [adminNotes, setAdminNotes] = useState<string>(application?.admin_notes || '');
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  React.useEffect(() => {
    if (application) {
      setAdminNotes(application.admin_notes || '');
    }
  }, [application]);

  const handleApprove = async () => {
    if (!application) return;
    
    setIsApproving(true);
    try {
      const { error } = await supabase
        .from('host_applications')
        .update({ 
          status: 'approved',
          admin_notes: adminNotes || null
        })
        .eq('id', application.id);
      
      if (error) throw error;
      
      toast({
        title: "Application approved",
        description: `${application.applicant_name || 'User'}'s application has been approved.`
      });
      
      onApplicationUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error approving application",
        description: error.message || "There was an error approving the application."
      });
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleDecline = async () => {
    if (!application) return;
    
    if (!adminNotes.trim()) {
      toast({
        variant: "destructive",
        title: "Admin notes required",
        description: "Please provide feedback for why the application was declined."
      });
      return;
    }
    
    setIsDeclining(true);
    try {
      const { error } = await supabase
        .from('host_applications')
        .update({ 
          status: 'declined',
          admin_notes: adminNotes
        })
        .eq('id', application.id);
      
      if (error) throw error;
      
      toast({
        title: "Application declined",
        description: `${application.applicant_name || 'User'}'s application has been declined.`
      });
      
      onApplicationUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error declining application",
        description: error.message || "There was an error declining the application."
      });
    } finally {
      setIsDeclining(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Host Application Review</DialogTitle>
          <DialogDescription>
            Review the application from {application.applicant_name || 'Unknown User'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Venue Name</h3>
              <p className="text-base">{application.venue_name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Venue Type</h3>
              <p className="text-base">{application.venue_type}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Location</h3>
              <p className="text-base">{application.venue_location}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Application Date</h3>
              <p className="text-base">{new Date(application.created_at).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Contact Email</h3>
              <p className="text-base">{application.contact_email}</p>
            </div>
            
            {application.contact_phone && (
              <div>
                <h3 className="font-medium text-sm text-gray-500">Contact Phone</h3>
                <p className="text-base">{application.contact_phone}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Description</h3>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="whitespace-pre-wrap">{application.venue_description}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <Label htmlFor="adminNotes" className="mb-1 block">Admin Notes/Feedback:</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide feedback or notes (required if declining)"
              className="resize-none h-24"
            />
            <p className="text-xs text-gray-500 mt-1">
              {application.status === 'pending' ? 
                "These notes will be shared with the applicant if the application is declined." : 
                "These notes have been shared with the applicant."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          
          <div className="flex gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={handleDecline}
                  disabled={isDeclining || isApproving}
                >
                  {isDeclining ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Declining...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                  disabled={isDeclining || isApproving}
                >
                  {isApproving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HostApplicationReviewModal;

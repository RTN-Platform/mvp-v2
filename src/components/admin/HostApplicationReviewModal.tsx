
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HostApplicationReviewModalProps {
  open: boolean; 
  onClose: () => void;
  application: {
    id: string;
    user_id: string;
    venue_name: string;
    venue_type: string;
    venue_location: string;
    venue_description: string;
    contact_email: string;
    contact_phone?: string;
    verification_documents?: string[];
    status: 'pending' | 'approved' | 'declined';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    applicant?: {
      full_name: string;
      avatar_url: string | null;
    };
  };
}

const HostApplicationReviewModal: React.FC<HostApplicationReviewModalProps> = ({
  open,
  onClose,
  application,
}) => {
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPending = application.status === "pending";

  const handleApprove = async () => {
    await updateApplicationStatus("approved");
  };

  const handleDecline = async () => {
    if (!adminNotes.trim()) {
      toast({
        variant: "destructive",
        title: "Notes required",
        description: "Please provide notes explaining why the application is being declined.",
      });
      return;
    }
    
    await updateApplicationStatus("declined");
  };

  const updateApplicationStatus = async (status: 'approved' | 'declined') => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('host_applications')
        .update({
          status,
          admin_notes: adminNotes,
        })
        .eq('id', application.id);
      
      if (error) throw error;
      
      toast({
        title: `Application ${status}`,
        description: `The host application has been ${status}.`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating application",
        description: error.message || "Failed to update application status.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format applicant name initials for avatar
  const getApplicantInitials = () => {
    if (!application.applicant || !application.applicant.full_name) return "U";
    
    const nameParts = application.applicant.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Host Application Review</DialogTitle>
          <DialogDescription>
            Review the application details and make a decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Applicant info section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={application.applicant?.avatar_url || undefined} />
                <AvatarFallback>{getApplicantInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{application.applicant?.full_name || "Unknown User"}</h3>
                <p className="text-sm text-gray-500">{application.contact_email}</p>
                {application.contact_phone && (
                  <p className="text-sm text-gray-500">{application.contact_phone}</p>
                )}
              </div>
            </div>
            
            <Badge
              className={
                application.status === 'pending' 
                  ? 'bg-amber-500' 
                  : application.status === 'approved' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }
            >
              {application.status.toUpperCase()}
            </Badge>
          </div>

          <Separator />

          {/* Venue Details */}
          <div>
            <h4 className="text-lg font-medium mb-3">Venue Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Venue Name</p>
                <p className="text-base">{application.venue_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Venue Type</p>
                <p className="text-base">{application.venue_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base">{application.venue_location}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base">{application.venue_description}</p>
            </div>
          </div>

          <Separator />

          {/* Admin Notes */}
          <div>
            <h4 className="text-lg font-medium mb-3">Admin Notes</h4>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this application (required if declining)..."
              className="h-24"
              disabled={!isPending || isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {isPending ? (
            <>
              <Button
                variant="destructive"
                onClick={handleDecline}
                disabled={isSubmitting}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Decline
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HostApplicationReviewModal;

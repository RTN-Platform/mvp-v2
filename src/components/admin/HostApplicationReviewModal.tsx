
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HostApplication {
  id: string;
  user_id: string;
  venue_name: string;
  venue_type: string;
  venue_location: string;
  venue_description: string;
  contact_email: string;
  contact_phone?: string | null;
  status: 'pending' | 'approved' | 'declined';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  applicant_name?: string;
  verification_documents?: string[] | null;
}

interface HostApplicationReviewModalProps {
  application: HostApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationUpdated?: () => void;
}

const HostApplicationReviewModal = ({
  application,
  open,
  onOpenChange,
  onApplicationUpdated
}: HostApplicationReviewModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onOpenChange(open);
      setAdminNotes("");
    }
  };

  const handleStatusUpdate = async (newStatus: 'approved' | 'declined') => {
    if (!application) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('host_applications')
        .update({
          status: newStatus,
          admin_notes: adminNotes || null
        })
        .eq('id', application.id);
      
      if (error) throw error;
      
      toast({
        title: `Application ${newStatus === 'approved' ? 'Approved' : 'Declined'}`,
        description: newStatus === 'approved' 
          ? `${application.applicant_name} has been approved as a host.`
          : `${application.applicant_name}'s application has been declined.`,
      });
      
      // Close modal and reset notes
      handleOpenChange(false);
      
      // Notify parent component that application was updated
      if (onApplicationUpdated) {
        onApplicationUpdated();
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating application",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!application) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Host Application Review</span>
            <Badge className={
              application.status === 'pending' ? "bg-amber-500" : 
              application.status === 'approved' ? "bg-green-500" : 
              "bg-red-500"
            }>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review host application details and approve or decline
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Applicant</h4>
            <p className="text-base">{application.applicant_name}</p>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Venue Name</h4>
            <p className="text-base">{application.venue_name}</p>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Venue Type</h4>
            <p className="text-base">{application.venue_type}</p>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Location</h4>
            <p className="text-base">{application.venue_location}</p>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-base whitespace-pre-wrap">{application.venue_description}</p>
          </div>

          <div className="grid gap-1">
            <h4 className="text-sm font-medium">Contact Email</h4>
            <p className="text-base">{application.contact_email}</p>
          </div>

          {application.contact_phone && (
            <div className="grid gap-1">
              <h4 className="text-sm font-medium">Contact Phone</h4>
              <p className="text-base">{application.contact_phone}</p>
            </div>
          )}

          {application.status === 'pending' && (
            <div className="grid gap-2 mt-4">
              <h4 className="text-sm font-medium">Admin Notes (optional)</h4>
              <p className="text-xs text-muted-foreground">These notes will be visible to the applicant if the application is declined</p>
              <Textarea 
                placeholder="Add notes about your decision..." 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          {application.admin_notes && application.status !== 'pending' && (
            <div className="grid gap-1 mt-4">
              <h4 className="text-sm font-medium">Admin Notes</h4>
              <p className="text-base whitespace-pre-wrap">{application.admin_notes}</p>
            </div>
          )}
        </div>

        {application.status === 'pending' && (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button 
              variant="outline" 
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => handleStatusUpdate('declined')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Decline Application
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusUpdate('approved')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve Application
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HostApplicationReviewModal;

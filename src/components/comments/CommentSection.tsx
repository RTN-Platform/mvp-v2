
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  experienceId: string;
  initialComments?: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ experienceId, initialComments = [] }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitComment = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id || "anonymous",
      userName: profile?.full_name || user.email?.split('@')[0] || "Anonymous User",
      userAvatar: profile?.avatar_url,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    // In a real app, we would make an API call here to save the comment
    // For now, just update the local state
    setComments([...comments, comment]);
    setNewComment("");

    // Store comment in localStorage for persistence
    const storedComments = JSON.parse(localStorage.getItem(`comments-${experienceId}`) || "[]");
    localStorage.setItem(`comments-${experienceId}`, JSON.stringify([...storedComments, comment]));

    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  // Load comments from localStorage on component mount
  React.useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${experienceId}`) || "[]");
    if (storedComments.length > 0) {
      setComments(storedComments);
    }
  }, [experienceId]);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Comments</h3>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.userAvatar} alt={comment.userName} />
              <AvatarFallback>
                {comment.userName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{comment.userName}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            Be the first to comment on this experience.
          </p>
        )}
      </div>

      <div className="mt-6">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment}>
            Post Comment
          </Button>
        </div>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to post comments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentSection;

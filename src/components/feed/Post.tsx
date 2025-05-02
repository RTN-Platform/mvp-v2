
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLikes } from "@/hooks/useLikes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PostProps {
  id: string;
  user: {
    id: string;
    name: string;
    location: string;
    avatar?: string;
  };
  content: {
    text: string;
    image?: string;
    hashtags: string[];
  };
  stats: {
    likes: number;
    comments: number;
  };
  createdAt: string;
  timeAgo: string;
}

const Post: React.FC<PostProps> = ({
  id,
  user,
  content,
  stats,
}) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isLiked, likeCount, handleLike } = useLikes(id, stats.likes);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  const handleLikeClick = () => {
    if (currentUser) {
      handleLike();
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleCommentClick = () => {
    navigate(`/experiences/${id}`);
  };

  return (
    <article className="post-container border rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Post Header - Title first, above the image */}
      <div className="p-4">
        <Link to={`/experiences/${id}`} className="block mb-3">
          <h2 className="font-semibold text-xl text-gray-900 hover:text-nature-700">
            {content.text}
          </h2>
        </Link>
      </div>
      
      {/* Post Image */}
      {content.image && (
        <div className="relative aspect-[4/3] w-full">
          <Link to={`/experiences/${id}`}>
            <img 
              src={content.image} 
              alt={content.text} 
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      )}
      
      {/* Post Footer - User info and interaction counts */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(part => part[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${user.id}`} className="font-medium text-gray-900 hover:text-nature-700">
                {user.name}
              </Link>
              <div className="text-sm text-gray-500">{user.location}</div>
            </div>
          </div>
          
          {/* Hashtags */}
          <div className="flex flex-wrap gap-1">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="text-nature-600 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Interaction buttons */}
        <div className="flex justify-end items-center gap-4 mt-3">
          <button 
            className={`flex items-center gap-1 ${isLiked ? 'text-nature-700' : 'text-gray-600 hover:text-nature-700'}`} 
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          <button 
            className="flex items-center gap-1 text-gray-600 hover:text-nature-700"
            onClick={handleCommentClick}
            aria-label="View comments"
          >
            <MessageSquare size={22} />
            <span className="text-sm font-medium">{stats.comments}</span>
          </button>
        </div>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to like posts and add them to your favorites.
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
    </article>
  );
};

export default Post;


import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useLikes(postId: string, initialLikeCount: number) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if the post is liked by the current user
  useEffect(() => {
    if (!user) return;
    
    // Check localStorage for liked status
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    setIsLiked(!!likedPosts[postId]);
  }, [postId, user]);

  const handleLike = () => {
    if (!user) return;

    // Toggle like status
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    
    // Update like count
    setLikeCount(prevCount => newIsLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
    
    // Store liked status in localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    
    if (newIsLiked) {
      likedPosts[postId] = true;
      
      // Add to favorites list
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(postId)) {
        favorites.push(postId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
      
      toast({
        title: "Added to favorites",
        description: "This post has been added to your favorites.",
      });
    } else {
      delete likedPosts[postId];
      
      // Remove from favorites list
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updatedFavorites = favorites.filter((id: string) => id !== postId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      
      toast({
        title: "Removed from favorites",
        description: "This post has been removed from your favorites.",
      });
    }
    
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  };

  return { isLiked, likeCount, handleLike };
}

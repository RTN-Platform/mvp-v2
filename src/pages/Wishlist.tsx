
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { posts } from "@/data/mockData";
import Post, { PostProps } from "@/components/feed/Post";

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const [favoritePosts, setFavoritePosts] = useState<PostProps[]>([]);
  
  useEffect(() => {
    if (user) {
      // Get favorite post IDs from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      // Get the corresponding posts from mock data
      const favoritePostsData = posts.filter(post => favorites.includes(post.id));
      setFavoritePosts(favoritePostsData);
    }
  }, [user]);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-nature-800">My Favourites</h1>
        </div>
        
        <Card className="mb-6 border-nature-200">
          <CardHeader className="border-b border-nature-100 bg-nature-50">
            <CardTitle className="text-xl text-nature-800">Saved Experiences & Accommodations</CardTitle>
            <CardDescription>Items you've favourited will appear here</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {favoritePosts.length > 0 ? (
              <div className="space-y-6">
                {favoritePosts.map(post => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-16 w-16 text-nature-200 mb-4" />
                <h3 className="text-lg font-medium text-nature-700 mb-2">Your favourites list is empty</h3>
                <p className="text-gray-500 max-w-md">
                  Explore accommodations and experiences and click the heart icon to save your favorites here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Wishlist;

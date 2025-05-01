
import React from "react";
import Post from "./Post";
import { posts } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Feed: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {!user && (
        <Card className="border-nature-200 mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-nature-50 p-6 border-b border-nature-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-nature-800 mb-2">
                    Join the RTN community
                  </h2>
                  <p className="text-gray-700">
                    Join the RTN community to receive personalised content, connect with like-minded explorers, and enjoy member benefits.
                  </p>
                </div>
                <Button 
                  className="bg-nature-600 hover:bg-nature-700 text-white whitespace-nowrap"
                  onClick={() => navigate("/auth")}
                >
                  Sign up now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;

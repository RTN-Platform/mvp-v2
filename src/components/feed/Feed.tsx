
import React from "react";
import Post from "./Post";
import { posts } from "@/data/mockData";

const Feed: React.FC = () => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;

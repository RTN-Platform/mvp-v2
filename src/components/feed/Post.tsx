
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
  timeAgo,
}) => {
  return (
    <article className="post-container">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="avatar-container">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(part => part[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${user.id}`} className="font-semibold text-gray-900 hover:text-nature-700">
                {user.name}
              </Link>
              <div className="text-sm text-gray-500">{user.location}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">{timeAgo}</div>
        </div>
      </div>
      
      {content.image && (
        <div className="relative aspect-[4/3] w-full">
          <img 
            src={content.image} 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="mb-3">
          <p className="text-gray-800 mb-2">{content.text}</p>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end items-center gap-6">
          <button className="flex items-center gap-1 text-gray-600 hover:text-nature-700">
            <Heart size={22} />
            <span className="text-sm font-medium">{stats.likes}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-nature-700">
            <MessageSquare size={22} />
            <span className="text-sm font-medium">{stats.comments}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default Post;

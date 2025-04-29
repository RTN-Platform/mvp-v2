
import { PostProps } from "@/components/feed/Post";

export const posts: PostProps[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Rachel Green",
      location: "Banff National Park, AB",
      avatar: "/lovable-uploads/292b9d72-6ede-4ba4-9656-1ab4970d7f8f.png",
    },
    content: {
      text: "Hiked to this incredible alpine lake today!",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      hashtags: ["hiking", "nature"],
    },
    stats: {
      likes: 298,
      comments: 12,
    },
    createdAt: "2023-04-27T14:23:00Z",
    timeAgo: "2d",
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Monica Smith",
      location: "Costa Rica",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    },
    content: {
      text: "Enjoying a relaxing glamping getaway in the rainforest",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      hashtags: ["glamping", "rainforest"],
    },
    stats: {
      likes: 156,
      comments: 8,
    },
    createdAt: "2023-04-22T10:15:00Z",
    timeAgo: "1w",
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Alex Johnson",
      location: "Zion National Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    },
    content: {
      text: "Watch the sunset over the canyon - absolutely breathtaking!",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      hashtags: ["sunset", "canyon", "adventure"],
    },
    stats: {
      likes: 421,
      comments: 23,
    },
    createdAt: "2023-04-24T19:45:00Z",
    timeAgo: "5d",
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Emma Wilson",
      location: "Yosemite Valley",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    },
    content: {
      text: "Morning trail run with this spectacular view. Who needs a gym when you have mountains?",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      hashtags: ["trailrunning", "mountains", "fitness"],
    },
    stats: {
      likes: 187,
      comments: 14,
    },
    createdAt: "2023-04-26T08:12:00Z",
    timeAgo: "3d",
  },
];

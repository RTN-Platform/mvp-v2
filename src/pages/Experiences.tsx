
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Search, SlidersHorizontal } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  participants: number;
  price: string;
  tags: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id,
  title,
  location,
  image,
  rating,
  participants,
  price,
  tags,
}) => {
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group">
      <Link to={`/experiences/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[80%]">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-white/80 text-gray-800 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/experiences/${id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-nature-700 transition-colors">{title}</h3>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users size={14} className="mr-1" />
            <span>{participants} spots left</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-nature-800">{price}</span>
          <Button 
            asChild
            className="bg-nature-600 hover:bg-nature-700 text-white"
          >
            <Link to={`/experiences/${id}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("popular");

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search by keyword, location, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-gray-300"
        />
      </div>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-full md:w-[200px] bg-white">
          <div className="flex items-center">
            <SlidersHorizontal size={16} className="mr-2" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const Experiences: React.FC = () => {
  const experiences = [
    {
      id: "hiking-banff",
      title: "Guided Hiking Tour in Banff",
      location: "Banff National Park, AB",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.9,
      participants: 4,
      price: "$129/person",
      tags: ["hiking", "mountains", "guided"],
    },
    {
      id: "costa-rica-rainforest",
      title: "Costa Rica Rainforest Experience",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.8,
      participants: 2,
      price: "$259/person",
      tags: ["rainforest", "wildlife", "adventure"],
    },
    {
      id: "wildlife-photography",
      title: "Wildlife Photography Workshop",
      location: "Yellowstone National Park",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.7,
      participants: 6,
      price: "$179/person",
      tags: ["photography", "wildlife", "workshop"],
    },
    {
      id: "coastal-trail",
      title: "Coastal Trail Expedition",
      location: "Olympic National Park",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.6,
      participants: 3,
      price: "$149/person",
      tags: ["coastal", "hiking", "expedition"],
    },
    {
      id: "desert-stargazing",
      title: "Desert Stargazing Tour",
      location: "Joshua Tree National Park",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.9,
      participants: 8,
      price: "$89/person",
      tags: ["stargazing", "desert", "night"],
    },
    {
      id: "mountain-yoga",
      title: "Mountain Yoga Retreat",
      location: "Aspen, Colorado",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=700&q=80",
      rating: 4.8,
      participants: 5,
      price: "$299/person",
      tags: ["yoga", "wellness", "mountains"],
    },
  ];

  const [displayCount, setDisplayCount] = useState(6);

  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore our amazing accommodation and experiences
          </h1>
          <p className="text-gray-600 mb-6">
            Discover your next adventure and plan to immerse yourself in nature
          </p>
          
          <SearchSection />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.slice(0, displayCount).map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </div>

        {displayCount < experiences.length && (
          <div className="mt-8 text-center">
            <Button 
              onClick={loadMore} 
              variant="outline" 
              className="border-nature-600 text-nature-700 hover:bg-nature-50"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Experiences;

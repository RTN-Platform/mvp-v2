
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  location: string;
  image: string;
  rating: number;
  participants: number;
  price: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  location,
  image,
  rating,
  participants,
  price,
}) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
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
          <Button className="bg-nature-600 hover:bg-nature-700 text-white">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Experiences: React.FC = () => {
  const experiences = [
    {
      title: "Guided Hiking Tour in Banff",
      location: "Banff National Park, AB",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.9,
      participants: 4,
      price: "$129/person",
    },
    {
      title: "Costa Rica Rainforest Experience",
      location: "Costa Rica",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.8,
      participants: 2,
      price: "$259/person",
    },
    {
      title: "Wildlife Photography Workshop",
      location: "Yellowstone National Park",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.7,
      participants: 6,
      price: "$179/person",
    },
    {
      title: "Coastal Trail Expedition",
      location: "Olympic National Park",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.6,
      participants: 3,
      price: "$149/person",
    },
    {
      title: "Desert Stargazing Tour",
      location: "Joshua Tree National Park",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
      rating: 4.9,
      participants: 8,
      price: "$89/person",
    },
    {
      title: "Mountain Yoga Retreat",
      location: "Aspen, Colorado",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=700&q=80",
      rating: 4.8,
      participants: 5,
      price: "$299/person",
    },
  ];

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nature Experiences</h1>
          <p className="text-gray-600">
            Discover guided adventures and immerse yourself in nature
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Experiences;

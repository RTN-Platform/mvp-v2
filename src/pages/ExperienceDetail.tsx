
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Star, Clock, Calendar as CalendarIcon, Check } from "lucide-react";
import CommentSection from "@/components/comments/CommentSection";
import { useIsMobile } from "@/hooks/use-mobile";
import HostInfoBadge from "@/components/listings/cards/HostInfoBadge";
import VerticalImageGallery from "@/components/listings/cards/VerticalImageGallery";

const ExperienceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(1);
  const isMobile = useIsMobile();
  const [showCarousel, setShowCarousel] = useState(true);
  
  // Toggle between carousel and vertical gallery view
  const toggleImageDisplay = () => {
    setShowCarousel(!showCarousel);
  };
  
  // Mock data for the experience detail page
  // In a real application, this would be fetched from an API based on the ID
  const experiences = [
    {
      id: "hiking-banff",
      host_id: "e07a73ae-f62b-4d12-9fab-7df519afd5bb", // Added host_id field
      title: "Guided Hiking Tour in Banff",
      location: "Banff National Park, AB",
      tagline: "Experience the breathtaking beauty of the Canadian Rockies",
      description: "Join us for an unforgettable guided hiking tour through the stunning landscapes of Banff National Park. Our experienced guides will lead you through some of the most picturesque trails in the Canadian Rockies, sharing insights about the local ecosystem, wildlife, and history. This tour is suitable for all levels of hikers, with options ranging from easy walks to more challenging treks.",
      images: [
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1486890598084-170dcfa7b92e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80",
      ],
      rating: 4.9,
      reviewCount: 128,
      price: "$129/person",
      duration: "6 hours",
      includes: [
        "Professional guide",
        "Transportation from central meeting point",
        "Snacks and water",
        "Safety equipment",
        "Photo opportunities"
      ],
      itinerary: [
        { time: "9:00 AM", activity: "Meet at the visitor center" },
        { time: "9:30 AM", activity: "Depart for trailhead" },
        { time: "10:00 AM", activity: "Begin guided hike" },
        { time: "12:00 PM", activity: "Lunch break with panoramic views" },
        { time: "1:00 PM", activity: "Continue hiking to scenic viewpoints" },
        { time: "3:00 PM", activity: "Return to trailhead" },
        { time: "3:30 PM", activity: "Return to visitor center" }
      ],
      tags: ["hiking", "mountains", "guided", "nature", "photography"],
      reviews: [
        { author: "Sarah M.", rating: 5, comment: "Absolutely breathtaking views and our guide was incredibly knowledgeable!" },
        { author: "Michael T.", rating: 5, comment: "One of the best hiking experiences I've ever had. Well organized and perfect pace." },
        { author: "Jennifer L.", rating: 4, comment: "Amazing experience, though the weather was a bit challenging. The guide adapted well!" }
      ]
    },
    {
      id: "costa-rica-rainforest",
      host_id: "f12a89bc-e34d-5678-9012-3456def78901", // Added host_id field
      title: "Costa Rica Rainforest Experience",
      location: "Costa Rica",
      tagline: "Immerse yourself in the vibrant ecosystem of a tropical rainforest",
      description: "Discover the incredible biodiversity of Costa Rica's lush rainforests with our comprehensive guided tour. Walk through hanging bridges, encounter exotic wildlife, and learn about conservation efforts in one of the world's most biodiverse regions. Our expert naturalist guides will help you spot monkeys, sloths, toucans, and countless other species in their natural habitat.",
      images: [
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1587997026483-ae7efa5ae990?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80",
        "https://images.unsplash.com/photo-1550236520-7050f3582da0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80",
      ],
      rating: 4.8,
      reviewCount: 95,
      price: "$259/person",
      duration: "Full day (8 hours)",
      includes: [
        "Bilingual naturalist guide",
        "Transportation from select hotels",
        "Entrance fees to all attractions",
        "Bottled water and tropical fruits",
        "Traditional Costa Rican lunch"
      ],
      itinerary: [
        { time: "7:00 AM", activity: "Hotel pickup" },
        { time: "8:30 AM", activity: "Arrive at rainforest reserve" },
        { time: "9:00 AM", activity: "Guided hanging bridges tour" },
        { time: "11:00 AM", activity: "Wildlife spotting hike" },
        { time: "1:00 PM", activity: "Traditional lunch" },
        { time: "2:30 PM", activity: "Waterfall visit and swimming opportunity" },
        { time: "4:00 PM", activity: "Depart for hotels" }
      ],
      tags: ["rainforest", "wildlife", "adventure", "ecotour", "biodiversity"],
      reviews: [
        { author: "David R.", rating: 5, comment: "Saw more wildlife than I ever expected! Our guide had eagle eyes for spotting animals." },
        { author: "Emma W.", rating: 5, comment: "The hanging bridges were amazing and gave us a unique perspective of the rainforest." },
        { author: "Robert J.", rating: 4, comment: "Great experience! Would recommend bringing extra bug spray though." }
      ]
    },
  ];

  const experience = experiences.find(exp => exp.id === id);

  if (!experience) {
    return (
      <MainLayout>
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience not found</h1>
          <Button onClick={() => navigate('/experiences')}>
            Back to Experiences
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleBookNow = () => {
    alert(`Booking for ${experience.title} on ${date?.toDateString() || 'selected date'} for ${participants} participants`);
    // Here you would typically redirect to a checkout or reservation page
  };

  return (
    <MainLayout>
      <div className="py-4 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Hero section with image display options */}
        <div className="mb-6 md:mb-8">
          {showCarousel ? (
            <Carousel className="w-full">
              <CarouselContent>
                {experience.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${experience.title} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <VerticalImageGallery 
              images={experience.images}
              alt={experience.title}
            />
          )}
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleImageDisplay}
            >
              {showCarousel ? "View as Gallery" : "View as Carousel"}
            </Button>
          </div>
        </div>

        {/* Main content layout that adapts to screen size */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6 lg:gap-8`}>
          {/* Left column - Experience details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="bg-nature-50 text-nature-700 border-nature-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-start gap-3 mb-3">
                <HostInfoBadge hostId={experience.host_id} />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
              <p className="text-lg text-gray-600 mb-3">{experience.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">{experience.location}</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 mr-1" />
                  <span className="font-medium">{experience.rating}</span>
                  <span className="text-gray-500 ml-1">({experience.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-600">{experience.duration}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="mb-2 w-full sm:w-auto">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4 space-y-4">
                <div>
                  <p className="text-gray-700 mb-4">{experience.description}</p>
                  <h3 className="font-semibold text-lg mb-3">What's included:</h3>
                  <ul className="space-y-2">
                    {experience.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check size={18} className="text-nature-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Comments section integrated directly after "what's included" */}
                <Separator className="my-6" />
                <CommentSection experienceId={experience.id} />
              </TabsContent>
              
              <TabsContent value="itinerary" className="mt-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-2">Your day at a glance:</h3>
                  <ol className="space-y-4">
                    {experience.itinerary.map((item, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row">
                        <div className="font-medium text-nature-700 w-24 flex-shrink-0 mb-1 sm:mb-0">
                          {item.time}
                        </div>
                        <div>
                          <p>{item.activity}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {experience.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{review.author}</h4>
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Booking widget that becomes full width on mobile */}
          <div className="lg:col-span-1">
            <Card className={isMobile ? "w-full" : "sticky top-24"}>
              <CardContent className="p-4 md:p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Book this experience</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-nature-800">{experience.price}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select date</label>
                    <div className="border rounded-md p-1 overflow-x-auto max-w-full">
                      <div className="min-w-[280px]">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          className="pointer-events-auto"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Participants</label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(p => Math.max(1, p - 1))}
                        disabled={participants <= 1}
                        className="h-10 w-10"
                        aria-label="Decrease participants"
                      >
                        -
                      </Button>
                      <span className="mx-4 w-8 text-center">{participants}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(p => p + 1)}
                        className="h-10 w-10"
                        aria-label="Increase participants"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleBookNow} 
                  className="w-full bg-nature-600 hover:bg-nature-700 text-white"
                  disabled={!date}
                >
                  {date ? 'Book Now' : 'Select a date'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperienceDetail;

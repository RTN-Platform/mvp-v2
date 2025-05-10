
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

// Imported refactored components
import ExperienceHeader from "@/components/experiences/ExperienceHeader";
import ExperienceGallery from "@/components/experiences/ExperienceGallery";
import ExperienceDescription from "@/components/experiences/ExperienceDescription";
import ExperienceItinerary from "@/components/experiences/ExperienceItinerary";
import ExperienceReviews from "@/components/experiences/ExperienceReviews";
import BookingWidget from "@/components/experiences/BookingWidget";

const ExperienceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showCarousel, setShowCarousel] = useState(true);
  
  // Mock data for the experience detail page
  // In a real application, this would be fetched from an API based on the ID
  const experiences = [
    {
      id: "hiking-banff",
      host_id: "e07a73ae-f62b-4d12-9fab-7df519afd5bb",
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
      host_id: "f12a89bc-e34d-5678-9012-3456def78901",
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

  const handleBookNow = (date?: Date, participants: number = 1) => {
    alert(`Booking for ${experience.title} on ${date?.toDateString() || 'selected date'} for ${participants} participants`);
    // Here you would typically redirect to a checkout or reservation page
  };

  const toggleImageDisplay = () => {
    setShowCarousel(!showCarousel);
  };

  return (
    <MainLayout>
      <div className="py-4 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Hero section with image display options */}
        <ExperienceGallery 
          images={experience.images}
          title={experience.title}
          showCarousel={showCarousel}
          onToggleView={toggleImageDisplay}
        />

        {/* Main content layout that adapts to screen size */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6 lg:gap-8`}>
          {/* Left column - Experience details */}
          <div className="lg:col-span-2">
            <ExperienceHeader experience={experience} />

            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="mb-2 w-full sm:w-auto">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4 space-y-4">
                <ExperienceDescription 
                  experienceId={experience.id}
                  description={experience.description}
                  includes={experience.includes}
                />
              </TabsContent>
              
              <TabsContent value="itinerary" className="mt-4">
                <ExperienceItinerary itinerary={experience.itinerary} />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <ExperienceReviews reviews={experience.reviews} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Booking widget that becomes full width on mobile */}
          <div className="lg:col-span-1">
            <div className={isMobile ? "w-full" : "sticky top-24"}>
              <BookingWidget
                price={experience.price}
                onBookNow={handleBookNow}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperienceDetail;

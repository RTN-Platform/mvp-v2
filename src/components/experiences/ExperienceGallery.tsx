
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VerticalImageGallery from "@/components/listings/cards/VerticalImageGallery";

type ExperienceGalleryProps = {
  images: string[];
  title: string;
  showCarousel: boolean;
  onToggleView: () => void;
};

const ExperienceGallery: React.FC<ExperienceGalleryProps> = ({
  images,
  title,
  showCarousel,
  onToggleView
}) => {
  return (
    <div className="mb-6 md:mb-8">
      {showCarousel ? (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`${title} - image ${index + 1}`}
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
        <VerticalImageGallery images={images} alt={title} />
      )}
      <div className="flex justify-end mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleView}
        >
          {showCarousel ? "View as Gallery" : "View as Carousel"}
        </Button>
      </div>
    </div>
  );
};

export default ExperienceGallery;

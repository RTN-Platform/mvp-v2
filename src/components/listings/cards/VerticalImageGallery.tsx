
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface VerticalImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

const VerticalImageGallery: React.FC<VerticalImageGalleryProps> = ({ images, alt, className }) => {
  if (!images || images.length === 0) {
    return (
      <div className={`rounded-lg bg-gray-100 flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {images.map((image, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative rounded-lg overflow-hidden"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={image}
                  alt={`${alt} - Image ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover"
                  style={{ aspectRatio: '16/9' }}
                  loading="lazy"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Image {index + 1} of {images.length}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      ))}
    </div>
  );
};

export default VerticalImageGallery;

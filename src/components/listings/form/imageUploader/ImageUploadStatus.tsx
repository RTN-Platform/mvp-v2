
import React from "react";

interface ImageUploadStatusProps {
  imageCount: number;
}

const ImageUploadStatus: React.FC<ImageUploadStatusProps> = ({ imageCount }) => {
  if (imageCount === 0) {
    return null;
  }
  
  return (
    <div className="text-sm text-gray-500">
      {imageCount} image{imageCount !== 1 ? 's' : ''} uploaded. Click on the check icon to set your cover image.
    </div>
  );
};

export default ImageUploadStatus;

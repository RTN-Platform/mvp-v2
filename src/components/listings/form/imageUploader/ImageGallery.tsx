
import React from "react";
import ImagePreview from "./ImagePreview";
import UploadProgressItem from "./UploadProgressItem";
import AddImageButton from "./AddImageButton";

interface ImageGalleryProps {
  imageUrls: string[];
  uploadProgress: Record<string, number>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  onRemoveImage: (index: number) => void;
  onAddImageClick: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imageUrls,
  uploadProgress,
  coverImageIndex,
  setCoverImageIndex,
  onRemoveImage,
  onAddImageClick,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {imageUrls.map((url, index) => (
        <ImagePreview
          key={url}
          url={url}
          index={index}
          isCover={index === coverImageIndex}
          onRemove={onRemoveImage}
          onSetCover={setCoverImageIndex}
        />
      ))}

      {Object.entries(uploadProgress).map(([id, progress]) => (
        progress < 100 && (
          <UploadProgressItem key={id} progress={progress} />
        )
      ))}

      <AddImageButton onClick={onAddImageClick} />
    </div>
  );
};

export default ImageGallery;

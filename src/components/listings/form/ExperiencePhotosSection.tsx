
import React from "react";
import { CardContent } from "@/components/ui/card";
import ImageUploader from "./ImageUploader";

interface ExperiencePhotosSectionProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  userId?: string;
  isEditing: boolean;
  initialData?: any;
}

const ExperiencePhotosSection: React.FC<ExperiencePhotosSectionProps> = ({
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  userId,
  isEditing,
  initialData,
}) => {
  return (
    <CardContent>
      <ImageUploader
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        coverImageIndex={coverImageIndex}
        setCoverImageIndex={setCoverImageIndex}
        userId={userId}
        isEditing={isEditing}
        initialImages={initialData?.images || []}
        entityType="experiences"
      />
    </CardContent>
  );
};

export default ExperiencePhotosSection;

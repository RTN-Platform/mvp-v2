
import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  coverImageIndex: number;
  setCoverImageIndex: (index: number) => void;
  userId?: string;
  isEditing: boolean;
  initialImages?: string[];
  entityType: 'accommodations' | 'experiences';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  userId,
  isEditing,
  initialImages,
  entityType,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userId) {
      return;
    }

    setIsUploading(true);
    const newFiles = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...newFiles]);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of newFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${entityType}/${userId}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(filePath, file);
        
        if (error) {
          throw error;
        }
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }
      
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newFiles.length} image${newFiles.length > 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload images. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
    toast({
      title: "Cover Image Set",
      description: "The selected image has been set as your cover image.",
    });
  };

  const removeImage = async (index: number) => {
    // If removing the cover image, reset cover image to first remaining image (or nothing)
    if (index === coverImageIndex) {
      if (imageUrls.length > 1) {
        // Set it to the first image that isn't the one being removed
        const newIndex = index === 0 ? 1 : 0;
        setCoverImageIndex(newIndex);
      } else {
        setCoverImageIndex(0);
      }
    } else if (index < coverImageIndex) {
      // If removing an image before the cover image, adjust the cover image index
      setCoverImageIndex(coverImageIndex - 1);
    }
    
    // Extract the file path from URL to delete from storage
    try {
      const urlToRemove = imageUrls[index];
      // Only attempt to delete if it's a new upload (not existing images when editing)
      if (!isEditing || !initialImages?.includes(urlToRemove)) {
        // URLs are in format: https://[project].supabase.co/storage/v1/object/public/listings/[path]
        const pathParts = urlToRemove.split('/listings/');
        if (pathParts.length > 1) {
          const filePath = `listings/${pathParts[1]}`;
          await supabase.storage.from('listings').remove([filePath]);
        }
      }
    } catch (error) {
      console.error('Error removing image from storage:', error);
    }
    
    // Remove the image from the state
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {imageUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={imageUrls[coverImageIndex]}
                alt="Cover"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Cover Image
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className={`w-full h-16 object-cover ${index === coverImageIndex ? 'ring-2 ring-nature-500' : ''}`}
                    onClick={() => setCoverImage(index)}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop images or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Upload at least 5 photos. First photo will be your cover image.
            </p>
          </div>
        )}
        <div className="mt-4">
          <Input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="images">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={isUploading}
              asChild
            >
              <span>
                {isUploading ? (
                  <>Uploading...</>
                ) : (
                  <>{imageUrls.length > 0 ? "Add More Photos" : "Upload Photos"}</>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

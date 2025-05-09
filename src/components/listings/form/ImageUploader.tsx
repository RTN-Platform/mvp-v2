
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface ImageUploaderProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
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
  initialImages = [],
  entityType,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newImageUrls = [...imageUrls];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${entityType}/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(entityType)
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from(entityType)
          .getPublicUrl(filePath);

        newImageUrls.push(data.publicUrl);
      }

      setImageUrls(newImageUrls);

      // If this is the first image, set it as the cover image
      if (coverImageIndex === -1 && newImageUrls.length > 0) {
        setCoverImageIndex(0);
      }
      
      toast({
        title: "Images uploaded",
        description: `${files.length} image${files.length > 1 ? 's' : ''} successfully uploaded`,
      });

      // Clear the input
      e.target.value = "";
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload one or more images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);

    // Adjust cover image index if needed
    if (index === coverImageIndex) {
      setCoverImageIndex(newImageUrls.length > 0 ? 0 : -1);
    } else if (index < coverImageIndex) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="images">Upload Images</Label>
        <div className="mt-2">
          <Label
            htmlFor="image-upload"
            className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Spinner size="md" />
                <span className="mt-2 text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload images
                </span>
              </div>
            )}
          </Label>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div>
          <Label>Your Images</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {imageUrls.map((url, index) => (
              <div
                key={url}
                className={`relative group border rounded-md overflow-hidden ${
                  index === coverImageIndex ? "ring-2 ring-primary" : ""
                }`}
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {index !== coverImageIndex && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white"
                        onClick={() => setCoverImage(index)}
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span className="ml-1 text-xs">Cover</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-white text-red-500 hover:text-red-700"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index === coverImageIndex && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

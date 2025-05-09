
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Image, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  userId?: string;
  isEditing?: boolean;
  initialImages?: string[];
  entityType: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  userId,
  isEditing = false,
  initialImages = [],
  entityType
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setIsUploading(true);
    
    try {
      const newImageUrls: string[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${userId || 'anonymous'}/${entityType}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading file:', error);
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: error.message,
          });
          continue;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
          
        newImageUrls.push(publicUrlData.publicUrl);
      }
      
      if (newImageUrls.length > 0) {
        setImageUrls(prev => [...prev, ...newImageUrls]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload images",
      });
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    // Create a new array without the removed image
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    
    // Update the cover image index if necessary
    if (index === coverImageIndex) {
      setCoverImageIndex(0);
    } else if (index < coverImageIndex) {
      setCoverImageIndex(coverImageIndex - 1);
    }
    
    setImageUrls(newImageUrls);
  };

  const handleSetCoverImage = (index: number) => {
    setCoverImageIndex(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group">
            <Card className={`w-24 h-24 overflow-hidden border-2 ${index === coverImageIndex ? 'border-green-500' : 'border-gray-200'}`}>
              <img 
                src={url} 
                alt={`Listing image ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </Card>
            
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              
              {index !== coverImageIndex && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-7 w-7 p-0 rounded-full ml-1"
                  onClick={() => handleSetCoverImage(index)}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {index === coverImageIndex && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
        
        {imageUrls.length === 0 && (
          <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-md border border-dashed border-gray-300">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <div>
        <label className="block">
          <Button
            variant="outline"
            type="button"
            disabled={isUploading}
            className="w-full"
            asChild
          >
            <span>
              <Image className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Images"}
            </span>
          </Button>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Select images for your listing. The first image or checked image will be used as the cover.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;

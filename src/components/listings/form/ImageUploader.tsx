
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Trash2, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { createBucketIfNotExists } from "@/utils/storage";

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

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  userId,
  isEditing,
  entityType
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadFile = useCallback(async (file: File) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upload images.",
      });
      return null;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a valid image format (JPG, PNG, or WebP).",
      });
      return null;
    }

    // Validate file size
    if (file.size > IMAGE_MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image size should be less than 5MB.",
      });
      return null;
    }

    const bucketName = entityType;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Ensure the bucket exists before uploading
    const bucketReady = await createBucketIfNotExists(bucketName);
    if (!bucketReady) {
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "Failed to prepare storage. Please try again later.",
      });
      return null;
    }

    try {
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error.message || "Failed to upload image.",
      });
      return null;
    }
  }, [userId, toast, entityType]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const newUploadProgress = { ...uploadProgress };

    // Update progress indicators for each file
    fileArray.forEach(file => {
      const id = URL.createObjectURL(file);
      newUploadProgress[id] = 0;
    });
    setUploadProgress(newUploadProgress);

    const uploadPromises = fileArray.map(async (file) => {
      const id = URL.createObjectURL(file);
      
      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[id] || 0;
            if (current < 90) {
              return { ...prev, [id]: current + 10 };
            }
            return prev;
          });
        }, 200);

        const url = await uploadFile(file);
        
        clearInterval(progressInterval);
        
        if (url) {
          setUploadProgress(prev => ({ ...prev, [id]: 100 }));
          return url;
        }
        return null;
      } catch (error) {
        console.error('Error in upload process:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url): url is string => url !== null);

    if (successfulUploads.length > 0) {
      setImageUrls(prevUrls => [...prevUrls, ...successfulUploads]);
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${successfulUploads.length} image${successfulUploads.length !== 1 ? 's' : ''}.`,
      });
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      
      // If removing the cover image, reset the cover image to the first image
      if (index === coverImageIndex) {
        setCoverImageIndex(newUrls.length > 0 ? 0 : -1);
      } else if (index < coverImageIndex) {
        // If removing an image before the cover image, adjust the cover image index
        setCoverImageIndex(coverImageIndex - 1);
      }
      
      return newUrls;
    });
  };

  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
    toast({
      title: "Cover Image Set",
      description: "This image will be used as the cover for your listing.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {imageUrls.map((url, index) => (
          <Card key={index} className="relative overflow-hidden h-32 w-32">
            <img 
              src={url} 
              alt={`Uploaded image ${index + 1}`} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={index === coverImageIndex ? "default" : "outline"} 
                  size="icon" 
                  className="h-8 w-8 bg-white text-gray-800 hover:bg-gray-100"
                  onClick={() => setCoverImage(index)}
                >
                  <CheckCircle2 className={`h-4 w-4 ${index === coverImageIndex ? 'text-green-500' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
            {index === coverImageIndex && (
              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                Cover
              </div>
            )}
          </Card>
        ))}

        {Object.keys(uploadProgress).map(id => (
          uploadProgress[id] < 100 && (
            <Card key={id} className="relative overflow-hidden h-32 w-32">
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Spinner size="sm" className="mb-1" />
                  <div className="text-xs text-gray-500">{uploadProgress[id]}%</div>
                </div>
              </div>
            </Card>
          )
        ))}

        <Card className="h-32 w-32 flex items-center justify-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-500">Add Image</p>
          </div>
        </Card>
      </div>

      <input 
        type="file" 
        accept="image/jpeg,image/png,image/webp" 
        multiple 
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
      />

      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload Images'}
      </Button>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-sm text-blue-700">
          <p><strong>Image Requirements:</strong></p>
          <ul className="list-disc pl-5 mt-1">
            <li>Accepted formats: JPG, PNG, WebP</li>
            <li>Maximum file size: 5MB per image</li>
            <li>For best results, use high-quality images with a 16:9 aspect ratio</li>
          </ul>
        </AlertDescription>
      </Alert>

      {imageUrls.length > 0 && (
        <div className="text-sm text-gray-500">
          {imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''} uploaded. Click on the check icon to set your cover image.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

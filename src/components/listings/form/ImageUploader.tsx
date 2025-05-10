
import React, { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImagePreview from "./imageUploader/ImagePreview";
import UploadProgressItem from "./imageUploader/UploadProgressItem";
import AddImageButton from "./imageUploader/AddImageButton";
import ImageRequirements from "./imageUploader/ImageRequirements";
import { useImageUpload } from "./imageUploader/useImageUpload";

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
  entityType
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, uploadProgress, setUploadProgress } = useImageUpload({ 
    userId, 
    entityType 
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUploadProgress = { ...uploadProgress };

    // Update progress indicators for each file
    fileArray.forEach(file => {
      const id = URL.createObjectURL(file);
      newUploadProgress[id] = 0;
    });
    setUploadProgress(() => newUploadProgress);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {imageUrls.map((url, index) => (
          <ImagePreview
            key={url}
            url={url}
            index={index}
            isCover={index === coverImageIndex}
            onRemove={removeImage}
            onSetCover={setCoverImageIndex}
          />
        ))}

        {Object.entries(uploadProgress).map(([id, progress]) => (
          progress < 100 && (
            <UploadProgressItem key={id} progress={progress} />
          )
        ))}

        <AddImageButton onClick={triggerFileInput} />
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
        onClick={triggerFileInput}
        disabled={uploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload Images'}
      </Button>

      <ImageRequirements />

      {imageUrls.length > 0 && (
        <div className="text-sm text-gray-500">
          {imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''} uploaded. Click on the check icon to set your cover image.
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

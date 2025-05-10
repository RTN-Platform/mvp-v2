
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createBucketIfNotExists } from "@/utils/storage";

interface UseImageUploadProps {
  userId?: string;
  entityType: 'accommodations' | 'experiences';
}

interface UseImageUploadReturn {
  uploadFile: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadProgress: Record<string, number>;
  setUploadProgress: (update: (prev: Record<string, number>) => Record<string, number>) => void;
}

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const useImageUpload = ({ userId, entityType }: UseImageUploadProps): UseImageUploadReturn => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
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

  return {
    uploadFile,
    uploading,
    uploadProgress,
    setUploadProgress,
  };
};


import { supabase } from "@/integrations/supabase/client";

// Function to check if a bucket exists
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return false;
    }
    
    return buckets?.some(bucket => bucket.name === bucketName) || false;
  } catch (error) {
    console.error('Error in checkBucketExists:', error);
    return false;
  }
};

// Function to get public URL for a file
export const getPublicUrl = (bucketName: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

// Initialize required storage buckets for the application
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    console.log('Starting storage initialization check...');
    
    // Check if buckets for accommodations and experiences exist
    const accommodationsExists = await checkBucketExists('accommodations');
    const experiencesExists = await checkBucketExists('experiences');
    
    console.log(`Storage check results: 
      - accommodations bucket: ${accommodationsExists ? 'exists' : 'missing'}
      - experiences bucket: ${experiencesExists ? 'exists' : 'missing'}`
    );
    
    if (!accommodationsExists || !experiencesExists) {
      console.log('One or more required storage buckets are missing.');
      return;
    }
    
    console.log('All required storage buckets are available and ready to use.');
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    throw error; // Re-throw to be caught by the calling function
  }
};

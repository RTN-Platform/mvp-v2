
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

// Function to create a bucket if it doesn't exist
export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket already exists
    const exists = await checkBucketExists(bucketName);
    
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create the bucket
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true // Make bucket public
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (error) {
    console.error('Error in createBucketIfNotExists:', error);
    return false;
  }
};

// Initialize required storage buckets for the application
export const initializeStorageBuckets = async (): Promise<void> => {
  // Create buckets for accommodations and experiences if they don't exist
  await createBucketIfNotExists('accommodations');
  await createBucketIfNotExists('experiences');
  
  console.log('Storage initialization complete');
};

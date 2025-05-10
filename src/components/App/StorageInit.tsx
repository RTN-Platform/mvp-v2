
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeStorageBuckets } from '@/utils/storage';

const StorageInit = () => {
  const { toast } = useToast();

  useEffect(() => {
    const checkStorage = async () => {
      try {
        console.log('StorageInit: Starting storage initialization check');
        await initializeStorageBuckets();
        console.log('StorageInit: Storage check complete');
      } catch (error) {
        console.error('StorageInit: Failed to check storage:', error);
        toast({
          variant: "destructive",
          title: "Storage Check Failed",
          description: "There was an issue checking storage availability. Some features may not work correctly.",
        });
      }
    };

    checkStorage();
  }, [toast]);

  return null; // This component doesn't render anything
};

export default StorageInit;

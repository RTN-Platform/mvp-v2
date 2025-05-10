
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeStorageBuckets } from '@/utils/storage';

const StorageInit = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log('StorageInit: Starting storage initialization');
        await initializeStorageBuckets();
        console.log('StorageInit: Storage initialization complete');
      } catch (error) {
        console.error('StorageInit: Failed to initialize storage:', error);
        toast({
          variant: "destructive",
          title: "Storage Initialization Failed",
          description: "There was an issue setting up storage. Some features may not work correctly.",
        });
      }
    };

    initStorage();
  }, [toast]);

  return null; // This component doesn't render anything
};

export default StorageInit;

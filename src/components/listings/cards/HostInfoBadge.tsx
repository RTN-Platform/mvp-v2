
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface HostInfoBadgeProps {
  hostId: string;
  className?: string;
}

const HostInfoBadge: React.FC<HostInfoBadgeProps> = ({ hostId, className }) => {
  const [hostName, setHostName] = useState<string>('');
  const [hostAvatar, setHostAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchHostInfo = async () => {
      if (!hostId) {
        setLoading(false);
        setError(true);
        return;
      }
      
      try {
        // Fetch host profile information from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', hostId)
          .single();

        if (error) {
          console.error('Error fetching host info:', error);
          setError(true);
          throw error;
        }

        if (data) {
          setHostName(data.full_name || 'Host');
          setHostAvatar(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching host info:', error);
        // Use a default name if we can't fetch the host info
        setHostName('Host');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (hostId) {
      fetchHostInfo();
    } else {
      setLoading(false);
    }
  }, [hostId]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">Host</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={hostAvatar || ''} alt={hostName} />
        <AvatarFallback>{hostName.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-gray-700">{hostName}</span>
    </div>
  );
};

export default HostInfoBadge;

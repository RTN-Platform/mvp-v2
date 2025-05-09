
import { supabase } from "@/integrations/supabase/client";

export async function getTrendingContent() {
  // Try to fetch from analytics view first
  try {
    const { data, error } = await supabase.from('analytics.v_trending_content').select('*');
    
    if (error) throw error;
    
    return data.map(item => ({
      title: item.title || `${item.content_type} ${item.content_id?.substring(0, 6)}`,
      engagement: item.engagement_count,
      type: item.content_type
    }));
  } catch (error) {
    console.warn('Could not fetch trending content:', error);
    return null;
  }
}

export async function getRecentEngagement() {
  try {
    const { data, error } = await supabase.from('analytics.v_recent_engagement').select('*');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.warn('Could not fetch recent engagement:', error);
    return null;
  }
}

// Update the useDashboardData.ts hook to use these functions

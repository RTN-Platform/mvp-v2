
import { supabase } from "@/integrations/supabase/client";

export type TrendingContentItem = {
  title: string;
  engagement: number;
  type: string;
  content_id?: string;
};

export type RecentEngagementItem = {
  hour: string;
  event_type: string;
  count: number;
};

export async function getTrendingContent(timeRange: string = '7 days'): Promise<TrendingContentItem[] | null> {
  // Try to fetch from analytics view first
  try {
    const { data, error } = await supabase
      .from('analytics.v_trending_content')
      .select('*')
      .order('engagement_count', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return data.map(item => ({
      title: item.title || `${item.content_type} ${item.content_id?.substring(0, 6)}`,
      engagement: item.engagement_count,
      type: item.content_type,
      content_id: item.content_id
    }));
  } catch (error) {
    console.warn('Could not fetch trending content:', error);
    return null;
  }
}

export async function getRecentEngagement(timeRange: string = '24 hours'): Promise<RecentEngagementItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('analytics.v_recent_engagement')
      .select('*')
      .order('hour', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      hour: item.hour,
      event_type: item.event_type,
      count: item.count
    }));
  } catch (error) {
    console.warn('Could not fetch recent engagement:', error);
    return null;
  }
}

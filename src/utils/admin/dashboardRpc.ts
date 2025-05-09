
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

export type ContentAnalyticsItem = {
  content_type: string;
  event_type: string;
  event_count: number;
  unique_users: number;
  event_day: string;
};

export type RetentionMetrics = {
  week: string;
  total_users: number;
  returning_users: number;
  retention_rate: number;
};

export async function getTrendingContent(timeRange: string = '7 days'): Promise<TrendingContentItem[] | null> {
  try {
    // Using Postgres RPC function instead of direct view access
    const { data, error } = await supabase.rpc('get_trending_content', { time_range: timeRange });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Fallback for empty data
      return [
        { title: "Experience 1", engagement: 42, type: "experiences" },
        { title: "Accommodation 1", engagement: 38, type: "accommodations" },
        { title: "Experience 2", engagement: 29, type: "experiences" },
        { title: "Accommodation 2", engagement: 23, type: "accommodations" },
        { title: "Experience 3", engagement: 19, type: "experiences" }
      ];
    }
    
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
    // Using Postgres RPC function instead of direct view access
    const { data, error } = await supabase.rpc('get_recent_engagement', { time_range: timeRange });
    
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

export async function getContentAnalytics(timeRange: string = '30 days'): Promise<ContentAnalyticsItem[] | null> {
  try {
    // Using Postgres RPC function
    const { data, error } = await supabase.rpc('get_content_analytics', { time_range: timeRange });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Fallback data if no analytics data exists yet
      return generateFallbackContentAnalytics();
    }
    
    return data.map(item => ({
      content_type: item.content_type,
      event_type: item.event_type,
      event_count: item.event_count,
      unique_users: item.unique_users,
      event_day: item.event_day
    }));
  } catch (error) {
    console.warn('Could not fetch content analytics:', error);
    return generateFallbackContentAnalytics();
  }
}

export async function getRetentionMetrics(timeRange: string = '90 days'): Promise<RetentionMetrics[] | null> {
  try {
    // Using Postgres RPC function 
    const { data, error } = await supabase.rpc('get_retention_metrics', { time_range: timeRange });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // Fallback retention data
      return generateFallbackRetentionMetrics();
    }
    
    return data.map(item => ({
      week: new Date(item.week).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      total_users: item.total_users,
      returning_users: item.returning_users,
      retention_rate: item.total_users > 0 ? Math.round((item.returning_users / item.total_users) * 100) : 0
    }));
  } catch (error) {
    console.warn('Could not fetch retention metrics:', error);
    return generateFallbackRetentionMetrics();
  }
}

// Helper functions to generate fallback data for demo purposes
function generateFallbackContentAnalytics(): ContentAnalyticsItem[] {
  const eventTypes = ['view', 'click', 'bookmark', 'share'];
  const contentTypes = ['experiences', 'accommodations'];
  const result: ContentAnalyticsItem[] = [];
  
  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    
    for (const contentType of contentTypes) {
      for (const eventType of eventTypes) {
        // Not every day has every type of event
        if (Math.random() > 0.3) {
          const eventCount = Math.floor(Math.random() * 50) + 1;
          const uniqueUsers = Math.floor(Math.random() * eventCount) + 1;
          
          result.push({
            content_type: contentType,
            event_type: eventType,
            event_count: eventCount,
            unique_users: uniqueUsers,
            event_day: dayStr
          });
        }
      }
    }
  }
  
  return result;
}

function generateFallbackRetentionMetrics(): RetentionMetrics[] {
  const result: RetentionMetrics[] = [];
  
  // Generate data for the last 12 weeks
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    
    const totalUsers = Math.floor(Math.random() * 100) + 50;
    const returningUsers = Math.floor(Math.random() * totalUsers);
    const retentionRate = Math.round((returningUsers / totalUsers) * 100);
    
    result.push({
      week: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      total_users: totalUsers,
      returning_users: returningUsers,
      retention_rate: retentionRate
    });
  }
  
  return result;
}
